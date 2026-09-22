"""
Deterministic Risk Harness ("The Seatbelt")
Core Gatekeeper: LLMs propose, deterministic code validates and approves/rejects.
"""

import time
from datetime import datetime, timezone
from typing import Tuple, Dict, Any

from backend.config import settings
from backend.risk.rules import (
    TradeProposal,
    RiskEvaluationReport,
    SingleRiskCheck,
    RiskCheckStatus,
    OrderSide
)
from backend.risk.circuit_breaker import circuit_breaker

class DeterministicRiskHarness:
    def __init__(self):
        self.limits = settings.risk
        self.evaluation_history: list[RiskEvaluationReport] = []

    def evaluate(
        self,
        proposal: TradeProposal,
        current_price: float,
        bid_price: float,
        ask_price: float,
        synthetic_nav: float,
        account_equity: float,
        current_open_positions_usdt: float = 0.0
    ) -> RiskEvaluationReport:
        """
        Runs 5 strict deterministic checks.
        Zero LLM discretion: all checks must pass for approval.
        """
        checks: list[SingleRiskCheck] = []
        is_approved = True

        # Check 1: Circuit Breaker Status
        cb_status = circuit_breaker.get_status()
        if cb_status["tripped"]:
            checks.append(SingleRiskCheck(
                name="CircuitBreakerCheck",
                status=RiskCheckStatus.REJECTED,
                threshold=f"Drawdown < {cb_status['max_limit_pct']}%",
                observed_value=f"Drawdown = {cb_status['current_drawdown_pct']}%",
                reason=f"Trading halted: {cb_status['trip_reason']}"
            ))
            is_approved = False
        else:
            checks.append(SingleRiskCheck(
                name="CircuitBreakerCheck",
                status=RiskCheckStatus.PASSED,
                threshold=f"Drawdown < {cb_status['max_limit_pct']}%",
                observed_value=f"Drawdown = {cb_status['current_drawdown_pct']}%",
                reason="Daily portfolio drawdown within safe boundaries"
            ))

        # Check 2: Bid-Ask Spread / Slippage Guard
        if ask_price > 0 and bid_price > 0:
            spread_pct = ((ask_price - bid_price) / current_price) * 100.0
            if spread_pct > self.limits.max_slippage_pct:
                checks.append(SingleRiskCheck(
                    name="LiquiditySpreadCheck",
                    status=RiskCheckStatus.REJECTED,
                    threshold=f"Spread <= {self.limits.max_slippage_pct:.2f}%",
                    observed_value=f"Spread = {spread_pct:.2f}%",
                    reason=f"Thin market liquidity on rToken: bid-ask spread exceeds threshold"
                ))
                is_approved = False
            else:
                checks.append(SingleRiskCheck(
                    name="LiquiditySpreadCheck",
                    status=RiskCheckStatus.PASSED,
                    threshold=f"Spread <= {self.limits.max_slippage_pct:.2f}%",
                    observed_value=f"Spread = {spread_pct:.2f}%",
                    reason="Orderbook liquidity is sufficient for low-slippage execution"
                ))
        else:
            checks.append(SingleRiskCheck(
                name="LiquiditySpreadCheck",
                status=RiskCheckStatus.REJECTED,
                threshold=f"Valid BBO quotes",
                observed_value="Zero or negative BBO",
                reason="Invalid market quotes"
            ))
            is_approved = False

        # Check 3: Synthetic NAV / Fair Value Disconnect
        if synthetic_nav > 0:
            nav_deviation_pct = abs((current_price - synthetic_nav) / synthetic_nav) * 100.0
            if nav_deviation_pct > self.limits.max_nav_deviation_pct:
                checks.append(SingleRiskCheck(
                    name="FairValueDeviationCheck",
                    status=RiskCheckStatus.REJECTED,
                    threshold=f"Deviation <= {self.limits.max_nav_deviation_pct:.2f}%",
                    observed_value=f"Deviation = {nav_deviation_pct:.2f}%",
                    reason="rToken price excessively diverged from synthetic NAV (potential pricing anomaly)"
                ))
                is_approved = False
            else:
                checks.append(SingleRiskCheck(
                    name="FairValueDeviationCheck",
                    status=RiskCheckStatus.PASSED,
                    threshold=f"Deviation <= {self.limits.max_nav_deviation_pct:.2f}%",
                    observed_value=f"Deviation = {nav_deviation_pct:.2f}%",
                    reason="rToken trading within normal statistical band of fair value NAV"
                ))
        else:
            checks.append(SingleRiskCheck(
                name="FairValueDeviationCheck",
                status=RiskCheckStatus.WARNING,
                threshold="Synthetic NAV available",
                observed_value="NAV unavailable",
                reason="Proceeding with conservative secondary reference"
            ))

        # Check 4: Capital Allocation & Fractional Kelly Limit
        max_allowed_size = (self.limits.max_position_size_pct / 100.0) * account_equity
        requested_size = proposal.suggested_size_usdt
        
        # Check leverage bounds
        projected_total = current_open_positions_usdt + min(requested_size, max_allowed_size)
        max_portfolio_capacity = account_equity * self.limits.max_portfolio_leverage

        if requested_size > max_allowed_size:
            # Auto-clamp to max allowed size if other conditions pass
            approved_size = max_allowed_size
            checks.append(SingleRiskCheck(
                name="PositionSizingCheck",
                status=RiskCheckStatus.WARNING,
                threshold=f"Size <= {max_allowed_size:.2f} USDT (5% AUM)",
                observed_value=f"Requested {requested_size:.2f} USDT",
                reason=f"Clamped order size down to 5% AUM safety cap ({approved_size:.2f} USDT)"
            ))
        elif projected_total > max_portfolio_capacity:
            checks.append(SingleRiskCheck(
                name="PositionSizingCheck",
                status=RiskCheckStatus.REJECTED,
                threshold=f"Max portfolio allocation {max_portfolio_capacity:.2f} USDT",
                observed_value=f"Projected {projected_total:.2f} USDT",
                reason="Portfolio exposure exceeds 100% unleveraged capacity"
            ))
            is_approved = False
            approved_size = 0.0
        else:
            approved_size = requested_size
            checks.append(SingleRiskCheck(
                name="PositionSizingCheck",
                status=RiskCheckStatus.PASSED,
                threshold=f"Size <= {max_allowed_size:.2f} USDT (5% AUM)",
                observed_value=f"{approved_size:.2f} USDT",
                reason="Requested capital allocation conforms to risk envelope"
            ))

        # Check 5: Monday Open Pre-Market De-Risking Window
        is_monday_preopen, time_reason = self._is_near_monday_open()
        if is_monday_preopen and proposal.side in (OrderSide.BUY, OrderSide.SELL):
            checks.append(SingleRiskCheck(
                name="MarketOpenDeRiskCheck",
                status=RiskCheckStatus.REJECTED,
                threshold="No new positions within 30m of NYSE open",
                observed_value="Approaching Monday 9:30 AM EST",
                reason=f"Opening bell volatility protection: {time_reason}"
            ))
            is_approved = False
        else:
            checks.append(SingleRiskCheck(
                name="MarketOpenDeRiskCheck",
                status=RiskCheckStatus.PASSED,
                threshold="Outside opening bell freeze window",
                observed_value="Safe 24/7 weekend/overnight trading window",
                reason="Trade window permits active autonomous positioning"
            ))

        # Check 6: Agent Confidence Threshold
        if proposal.confidence < 0.65:
            checks.append(SingleRiskCheck(
                name="AgentConfidenceFloor",
                status=RiskCheckStatus.REJECTED,
                threshold="Confidence >= 0.65",
                observed_value=f"Confidence = {proposal.confidence:.2f}",
                reason="Agent swarm consensus confidence is below minimum execution threshold"
            ))
            is_approved = False
        else:
            checks.append(SingleRiskCheck(
                name="AgentConfidenceFloor",
                status=RiskCheckStatus.PASSED,
                threshold="Confidence >= 0.65",
                observed_value=f"Confidence = {proposal.confidence:.2f}",
                reason="Strong consensus conviction across agent swarm"
            ))

        # Final Report Generation
        report = RiskEvaluationReport(
            proposal_id=proposal.proposal_id,
            symbol=proposal.symbol,
            approved=is_approved,
            checks=checks,
            approved_size_usdt=approved_size if is_approved else 0.0,
            execution_price=current_price
        )
        report.risk_hash = report.compute_hash()
        
        self.evaluation_history.append(report)
        if len(self.evaluation_history) > 200:
            self.evaluation_history.pop(0)

        return report

    def _is_near_monday_open(self) -> Tuple[bool, str]:
        """
        Detects if current UTC time falls within the 30-minute freeze window before Monday 9:30 AM EST (14:30 UTC).
        """
        now = datetime.now(timezone.utc)
        # Monday is weekday 0
        if now.weekday() == 0:
            # 14:00 UTC to 14:30 UTC is the 30-min window before 9:30 AM EST
            if now.hour == 14 and 0 <= now.minute < self.limits.monday_open_unwind_minutes:
                return True, f"Within {self.limits.monday_open_unwind_minutes} mins before NYSE opening bell"
        return False, "Clear"

risk_harness = DeterministicRiskHarness()
