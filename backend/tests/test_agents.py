"""
Tests for Multi-Agent Consensus Swarm
"""

import pytest
from backend.agents.consensus_agent import consensus_orchestrator
from backend.risk.rules import OrderSide

@pytest.mark.asyncio
async def test_consensus_bullish_event():
    event = {
        "id": "test_fed_cut",
        "title": "Unscheduled Fed Rate Cut",
        "content": "Emergency 50 bps easing announced over the weekend.",
        "affected_symbols": ["NVDAUSDT"],
        "implied_bias": "STRONG_BULLISH",
        "target_move_pct": 3.5
    }
    
    proposal, thoughts, summary = await consensus_orchestrator.run_deliberation(
        symbol="NVDAUSDT",
        event_data=event
    )
    
    assert proposal.symbol == "NVDAUSDT"
    assert proposal.side == OrderSide.BUY
    assert proposal.confidence >= 0.75
    assert len(thoughts) == 3
    assert "Consensus reached: STRONG BUY" in summary

@pytest.mark.asyncio
async def test_consensus_bearish_event():
    event = {
        "id": "test_shipping_disruption",
        "title": "Severe Shipping Disruption",
        "content": "Supply lines blocked unexpectedly.",
        "affected_symbols": ["SPYUSDT"],
        "implied_bias": "BEARISH",
        "target_move_pct": -2.5
    }
    
    proposal, thoughts, summary = await consensus_orchestrator.run_deliberation(
        symbol="SPYUSDT",
        event_data=event
    )
    
    assert proposal.symbol == "SPYUSDT"
    assert proposal.side == OrderSide.SELL
    assert proposal.confidence >= 0.65
