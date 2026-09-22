"""
MacroAnalystAgent
Specializes in global monetary policy, interest rates, dollar index (DXY), and cross-asset beta.
"""

from typing import Dict, Any
from backend.agents.base_agent import BaseAgent, AgentThought
from backend.connectors.bitget_signal import bitget_signal

class MacroAnalystAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="MacroAnalyst", role="Global Cross-Asset & Monetary Regime Specialist")

    async def analyze(self, symbol: str, event_data: Dict[str, Any]) -> AgentThought:
        macro_data = await bitget_signal.get_macro_analysis()
        sentiment_data = await bitget_signal.get_sentiment_analysis()
        
        event_impact = event_data.get("implied_bias", "NEUTRAL")
        event_content = event_data.get("content", "")

        # Evaluation logic
        dxy = macro_data["dxy_index"]
        dovish_bias = "Dovish" in macro_data["fed_rate_posture"] or "cut" in event_content.lower()

        if dovish_bias and ("STRONG_BULLISH" in event_impact or "BULLISH" in event_impact):
            verdict = "BULLISH"
            confidence = 0.86
            analysis = (
                f"Global liquidity regime is highly supportive. DXY at {dxy} demonstrates dollar softening, "
                f"while the 90-day BTC/Nasdaq correlation ({macro_data['btc_nasdaq_90d_corr']}) indicates high cross-market transmission. "
                f"Weekend event confirms dovish tailwind for tech/growth equities like {symbol}."
            )
        elif "BEARISH" in event_impact:
            verdict = "BEARISH"
            confidence = 0.78
            analysis = (
                f"Risk-off contagion detected. Event introduces geopolitical/macro friction. "
                f"Yield curve pressure coupled with event headwinds suggests cautious defensive posture."
            )
        else:
            verdict = "NEUTRAL"
            confidence = 0.65
            analysis = "Macro variables are balanced; monetary policy remains within expected pricing bands."

        return AgentThought(
            agent_name=self.name,
            role=self.role,
            observation=f"DXY: {dxy}, Fed Posture: {macro_data['fed_rate_posture']}, Event: {event_data.get('title')}",
            analysis=analysis,
            verdict=verdict,
            confidence=confidence,
            key_metrics={
                "dxy": dxy,
                "us10y": macro_data["us10y_yield"],
                "regime": macro_data["macro_regime"],
                "cross_asset_corr": macro_data["btc_nasdaq_90d_corr"]
            }
        )

macro_agent = MacroAnalystAgent()
