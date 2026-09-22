"""
Aegis24 FastAPI Application Entrypoint
Bitget AI x Crypto Hackathon Season 2 (Track 2: Agentic Trading)
"""

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any, Optional
import time

from backend.config import settings
from backend.connectors.bitget_mcp import bitget_mcp
from backend.connectors.bitget_signal import bitget_signal
from backend.connectors.bitget_hub import bitget_hub
from backend.connectors.mock_feed import event_simulator
from backend.agents.consensus_agent import consensus_orchestrator
from backend.risk.harness import risk_harness
from backend.risk.circuit_breaker import circuit_breaker
from backend.engine.paper_trader import paper_trader
from backend.engine.backtester import backtest_engine
from backend.engine.playbook_exporter import playbook_exporter

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Autonomous 24/7 rToken & US Equity Event-Driven Trading Agent with Deterministic Safety Harness"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# On startup, initialize 60-day backtest if not present
@app.on_event("startup")
async def startup_event():
    backtest_engine.run_60d_backtest()

@app.get("/api/status")
async def get_system_status() -> Dict[str, Any]:
    account = bitget_hub.get_account_status()
    cb_status = circuit_breaker.get_status()
    return {
        "status": "ONLINE",
        "app_name": settings.app_name,
        "version": settings.version,
        "account": account,
        "circuit_breaker": cb_status,
        "risk_limits": settings.risk.model_dump(),
        "supported_rtokens": settings.supported_rtokens,
        "server_time_utc": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
    }

@app.get("/api/market")
async def get_market_overview() -> Dict[str, Any]:
    quotes = {}
    for sym in settings.supported_rtokens:
        quotes[sym] = await bitget_mcp.get_stock_quote(sym)
    
    # Update position PnLs with current prices
    price_map = {sym: q.get("price", 100.0) for sym, q in quotes.items()}
    bitget_hub.update_position_prices(price_map)

    macro = await bitget_signal.get_macro_analysis()
    sentiment = await bitget_signal.get_sentiment_analysis()

    return {
        "rtokens": quotes,
        "macro_signal": macro,
        "sentiment_signal": sentiment
    }

@app.get("/api/agent/debates")
async def get_recent_debates() -> Dict[str, Any]:
    return {
        "debates": consensus_orchestrator.debate_history[-20:],
        "count": len(consensus_orchestrator.debate_history)
    }

@app.get("/api/risk/evaluations")
async def get_risk_evaluations() -> Dict[str, Any]:
    return {
        "evaluations": [e.model_dump() for e in risk_harness.evaluation_history[-30:]],
        "total_evaluations": len(risk_harness.evaluation_history)
    }

@app.get("/api/positions")
async def get_open_positions() -> Dict[str, Any]:
    return {
        "positions": list(bitget_hub.positions.values()),
        "account_summary": bitget_hub.get_account_status()
    }

@app.get("/api/paper-trading/logs")
async def get_paper_trading_logs() -> Dict[str, Any]:
    return {
        "logs": paper_trader.logs[-100:],
        "total_trades": len(paper_trader.logs)
    }

@app.get("/api/backtest")
async def get_backtest_report() -> Dict[str, Any]:
    report = backtest_engine.run_60d_backtest()
    return report

@app.get("/api/events/presets")
async def get_preset_events():
    return {
        "presets": event_simulator.get_preset_events()
    }

@app.post("/api/events/inject")
async def inject_event(
    event_id: Optional[str] = Body(None),
    custom_symbol: Optional[str] = Body("NVDAUSDT"),
    custom_title: Optional[str] = Body(None),
    custom_content: Optional[str] = Body(None),
    custom_bias: Optional[str] = Body("STRONG_BULLISH"),
    custom_target_move: Optional[float] = Body(3.5)
) -> Dict[str, Any]:
    """
    Simulates a breaking overnight/weekend market shock.
    Triggers: Perception -> Multi-Agent Debate -> Risk Seatbelt -> Paper Execution.
    """
    if event_id:
        event = event_simulator.get_event_by_id(event_id)
        symbol = event.get("affected_symbols", ["NVDAUSDT"])[0]
    else:
        symbol = custom_symbol or "NVDAUSDT"
        event = {
            "id": f"custom_{int(time.time())}",
            "title": custom_title or "Unscheduled Breaking Event",
            "content": custom_content or "High impact information shock occurred outside NYSE standard hours.",
            "category": "User Injected Catalyst",
            "affected_symbols": [symbol],
            "implied_bias": custom_bias,
            "target_move_pct": custom_target_move
        }

    # 1. Multi-Agent Swarm Deliberation
    proposal, agent_thoughts, debate_summary = await consensus_orchestrator.run_deliberation(
        symbol=symbol,
        event_data=event
    )

    # 2. Risk Gatekeeper Evaluation & Execution
    result = paper_trader.process_proposal(proposal)

    return {
        "triggered_event": event,
        "deliberation": {
            "agent_thoughts": [t.model_dump() for t in agent_thoughts],
            "debate_summary": debate_summary
        },
        "execution_result": result
    }

@app.get("/api/playbook/export")
async def export_playbook(symbol: str = "NVDAUSDT"):
    code = playbook_exporter.generate_playbook_code(symbol)
    return {
        "symbol": symbol,
        "playbook_card_name": f"Aegis24-Overnight-Alpha-{symbol}",
        "code": code
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.port, reload=True)
