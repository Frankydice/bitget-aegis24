"""
MicroEarningsAgent
Specializes in corporate fundamentals, balance sheets, earnings surprises, and corporate disclosures.
"""

from typing import Dict, Any
from backend.agents.base_agent import BaseAgent, AgentThought
from backend.connectors.bitget_mcp import bitget_mcp

class MicroEarningsAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="MicroEarningsAnalyst", role="Corporate Fundamentals & News Catalyst Specialist")

    async def analyze(self, symbol: str, event_data: Dict[str, Any]) -> AgentThought:
        fundamentals = await bitget_mcp.get_fundamentals(symbol)
        clean_symbol = symbol.replace("USDT", "")
        
        event_title = event_data.get("title", "")
        event_content = event_data.get("content", "")

        raw_affected = event_data.get("affected_symbols", [symbol])
        clean_affected = [s.replace("USDT", "").replace("/", "") for s in raw_affected]
        is_affected = clean_symbol in clean_affected or symbol in raw_affected or not raw_affected
        
        forward_pe = fundamentals.get("forward_pe", 25.0)
        consensus = fundamentals.get("analyst_consensus", "Hold")
        growth_yoy = fundamentals.get("revenue_growth_yoy", 15.0)
        bias = event_data.get("implied_bias", "NEUTRAL")

        is_bullish_news = any(k in event_title.lower() or k in event_content.lower() for k in ["capex", "clearance", "emergency", "cut", "easing", "beat", "surge", "approval"])
        is_bearish_news = any(k in event_title.lower() or k in event_content.lower() for k in ["disruption", "war", "hike", "escalation", "drop", "miss", "crash", "ban"])

        if is_affected and (is_bullish_news or "BULLISH" in bias):
            verdict = "BULLISH"
            confidence = 0.91
            analysis = (
                f"High-conviction fundamental catalyst identified for {clean_symbol}. "
                f"Trailing YoY growth of {growth_yoy}% is strongly reinforced by news '{event_title}'. "
                f"Analyst consensus sits at '{consensus}' with forward P/E of {forward_pe}x adequately pricing in current upside."
            )
        elif is_affected and (is_bearish_news or "BEARISH" in bias):
            verdict = "BEARISH"
            confidence = 0.84
            analysis = f"Supply chain or operational vulnerability triggered for {clean_symbol}. Downgrading short-term fundamental momentum."
        else:
            verdict = "NEUTRAL"
            confidence = 0.68
            analysis = f"Company fundamentals remain steady. No direct idiosyncratic deviation detected for {clean_symbol}."

        return AgentThought(
            agent_name=self.name,
            role=self.role,
            observation=f"Consensus: {consensus}, Forward P/E: {forward_pe}x, Growth YoY: {growth_yoy}%",
            analysis=analysis,
            verdict=verdict,
            confidence=confidence,
            key_metrics={
                "forward_pe": forward_pe,
                "analyst_consensus": consensus,
                "growth_yoy": growth_yoy,
                "catalyst_impact": "Direct" if is_affected else "Indirect"
            }
        )

earnings_agent = MicroEarningsAgent()
