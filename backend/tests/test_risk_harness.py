"""
Tests for Deterministic Risk Harness
Validates zero-discretion invariant enforcement ("The Seatbelt").
"""

import pytest
from backend.risk.rules import TradeProposal, OrderSide, RiskCheckStatus
from backend.risk.harness import DeterministicRiskHarness
from backend.risk.circuit_breaker import CircuitBreaker

def test_slippage_check_rejection():
    harness = DeterministicRiskHarness()
    proposal = TradeProposal(
        symbol="NVDAUSDT",
        side=OrderSide.BUY,
        confidence=0.85,
        thesis="Test thesis",
        suggested_size_usdt=2000.0,
        target_price=135.0
    )
    
    # Spread is (130 - 128) / 129 = 1.55% (> 0.35% limit)
    report = harness.evaluate(
        proposal=proposal,
        current_price=129.0,
        bid_price=128.0,
        ask_price=130.0,
        synthetic_nav=129.0,
        account_equity=100_000.0
    )
    
    assert report.approved is False
    spread_check = next(c for c in report.checks if c.name == "LiquiditySpreadCheck")
    assert spread_check.status == RiskCheckStatus.REJECTED

def test_fair_value_nav_deviation_rejection():
    harness = DeterministicRiskHarness()
    proposal = TradeProposal(
        symbol="TSLAUSDT",
        side=OrderSide.BUY,
        confidence=0.88,
        thesis="Test thesis",
        suggested_size_usdt=2000.0,
        target_price=250.0
    )
    
    # Current price 260 vs NAV 240 = 8.3% deviation (> 2.5% limit)
    report = harness.evaluate(
        proposal=proposal,
        current_price=260.0,
        bid_price=259.8,
        ask_price=260.2,
        synthetic_nav=240.0,
        account_equity=100_000.0
    )
    
    assert report.approved is False
    nav_check = next(c for c in report.checks if c.name == "FairValueDeviationCheck")
    assert nav_check.status == RiskCheckStatus.REJECTED

def test_position_sizing_clamping():
    harness = DeterministicRiskHarness()
    proposal = TradeProposal(
        symbol="NVDAUSDT",
        side=OrderSide.BUY,
        confidence=0.90,
        thesis="High conviction",
        suggested_size_usdt=15_000.0, # Asks for 15k on a 100k account (15% > 5% max)
        target_price=135.0
    )
    
    report = harness.evaluate(
        proposal=proposal,
        current_price=128.0,
        bid_price=127.9,
        ask_price=128.1,
        synthetic_nav=128.0,
        account_equity=100_000.0
    )
    
    assert report.approved is True
    # Clamped to 5% of 100,000 = 5,000 USDT
    assert report.approved_size_usdt == 5000.0
    size_check = next(c for c in report.checks if c.name == "PositionSizingCheck")
    assert size_check.status == RiskCheckStatus.WARNING

def test_circuit_breaker_tripping():
    cb = CircuitBreaker(max_drawdown_pct=2.0)
    cb.update_equity(100_000.0)
    assert cb.is_active() is False
    
    # Equity drops to 97,000 (3% drawdown > 2% limit)
    cb.update_equity(97_000.0)
    assert cb.is_active() is True
    status = cb.get_status()
    assert status["status"] == "HALTED"
