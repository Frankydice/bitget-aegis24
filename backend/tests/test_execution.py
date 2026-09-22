"""
Tests for Execution, Audit Logging, and Backtesting
"""

import os
import pytest
from backend.risk.rules import TradeProposal, OrderSide
from backend.engine.paper_trader import paper_trader, DATA_DIR, LOG_JSON_PATH
from backend.engine.backtester import backtest_engine

def test_paper_trading_execution_and_log():
    proposal = TradeProposal(
        symbol="NVDAUSDT",
        side=OrderSide.BUY,
        confidence=0.92,
        thesis="High conviction breakout",
        suggested_size_usdt=3000.0,
        target_price=135.0
    )
    
    result = paper_trader.process_proposal(proposal)
    assert result["risk_report"]["approved"] is True
    assert result["executed_order"] is not None
    assert result["executed_order"]["order_status"] == "FILLED"
    assert os.path.exists(LOG_JSON_PATH)

def test_60d_backtest_report_metrics():
    report = backtest_engine.run_60d_backtest()
    metrics = report["summary_metrics"]
    
    assert metrics["sharpe_ratio"] > 1.8
    assert metrics["sortino_ratio"] > 2.0
    assert metrics["max_drawdown_pct"] < 15.0
    assert metrics["win_rate_pct"] >= 55.0
    assert metrics["sharpe_decay_ratio"] >= 0.50 # Overfitting safety gatekeeper
    assert len(report["rolling_30d_sharpe_stability"]) == 4
