"""
MicrostructureArbAgent
Specializes in rToken vs Synthetic NAV spread, liquidity depth, and execution friction.
"""

from typing import Dict, Any
from backend.agents.base_agent import BaseAgent, AgentThought
from backend.connectors.bitget_mcp import bitget_mcp

class MicrostructureArbAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="MicrostructureArb", role="rToken Spread, NAV Parity & Liquidity Specialist")

    async def analyze(self, symbol: str, event_data: Dict[str, Any]) -> AgentThought:
        quote = await bitget_mcp.get_stock_quote(symbol)
        
        price = quote.get("price", 100.0)
        bid = quote.get("bid", 99.9)
        ask = quote.get("ask", 100.1)
        nav = quote.get("synthetic_nav", price)

        spread_pct = ((ask - bid) / price) * 100.0
        nav_discount_premium_pct = ((price - nav) / nav) * 100.0

        # Assess microstructure
        is_spread_tight = spread_pct <= 0.35
        is_nav_aligned = abs(nav_discount_premium_pct) <= 2.50

        if is_spread_tight and is_nav_aligned:
            verdict = "ARB_FAVORABLE"
            confidence = 0.89
            analysis = (
                f"rToken orderbook displays healthy 24/7 liquidity: Bid-Ask spread is tight at {spread_pct:.2f}% "
                f"(under 0.35% threshold). Trading at {nav_discount_premium_pct:+.2f}% premium/discount to synthetic NAV, "
                f"indicating low mispricing risk and minimal execution slippage."
            )
        elif not is_spread_tight:
            verdict = "HIGH_SLIPPAGE_RISK"
            confidence = 0.72
            analysis = f"Weekend book is thin. Spread is {spread_pct:.2f}%, exceeding 0.35% limit. Sizing should be minimized."
        else:
            verdict = "NAV_DISCONNECT"
            confidence = 0.65
            analysis = f"rToken disconnected from NAV by {nav_discount_premium_pct:.2f}%. Caution advised."

        return AgentThought(
            agent_name=self.name,
            role=self.role,
            observation=f"Price: {price}, NAV: {nav}, Spread: {spread_pct:.2f}%, Premium: {nav_discount_premium_pct:+.2f}%",
            analysis=analysis,
            verdict=verdict,
            confidence=confidence,
            key_metrics={
                "bid_ask_spread_pct": round(spread_pct, 3),
                "nav_deviation_pct": round(nav_discount_premium_pct, 3),
                "liquidity_grade": "A" if is_spread_tight else "C",
                "volume_24h": quote.get("volume_24h", 0)
            }
        )

arb_agent = MicrostructureArbAgent()
