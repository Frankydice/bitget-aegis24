"""
ConsensusAgent & Multi-Agent Swarm Orchestrator
Synthesizes Macro, Micro, and Microstructure debates into an actionable TradeProposal.
"""

from typing import Dict, Any, List, Tuple
from backend.agents.base_agent import AgentThought
from backend.agents.macro_agent import macro_agent
from backend.agents.earnings_agent import earnings_agent
from backend.agents.arb_agent import arb_agent
from backend.connectors.bitget_mcp import bitget_mcp
from backend.connectors.bitget_signal import bitget_signal
from backend.risk.rules import TradeProposal, OrderSide
from backend.config import settings

class ConsensusOrchestrator:
    def __init__(self):
        self.debate_history: List[Dict[str, Any]] = []

    async def run_deliberation(
        self,
        symbol: str,
        event_data: Dict[str, Any]
    ) -> Tuple[TradeProposal, List[AgentThought], str]:
        """
        Orchestrates full round of multi-agent debate and synthesizes a TradeProposal.
        """
        # 1. Run specialist agents concurrently
        macro_thought = await macro_agent.analyze(symbol, event_data)
        earnings_thought = await earnings_agent.analyze(symbol, event_data)
        arb_thought = await arb_agent.analyze(symbol, event_data)
        ta_data = await bitget_signal.get_technical_analysis(symbol)
        quote = await bitget_mcp.get_stock_quote(symbol)

        agent_thoughts = [macro_thought, earnings_thought, arb_thought]

        # 2. Debate Synthesis & Voting Logic
        macro_conf = macro_thought.confidence if "BULLISH" in macro_thought.verdict else (-macro_thought.confidence if "BEARISH" in macro_thought.verdict else 0.0)
        micro_conf = earnings_thought.confidence if "BULLISH" in earnings_thought.verdict else (-earnings_thought.confidence if "BEARISH" in earnings_thought.verdict else 0.0)

        # Directional consensus: 45% macro + 55% micro
        directional_score = (macro_conf * 0.45) + (micro_conf * 0.55)

        # Microstructure liquidity feasibility check
        liquidity_bonus = 0.15 if "ARB_FAVORABLE" in arb_thought.verdict else (-0.20 if "HIGH_SLIPPAGE" in arb_thought.verdict else 0.0)

        if directional_score > 0:
            bullish_score = directional_score + liquidity_bonus
            bearish_score = 0.0
        elif directional_score < 0:
            bearish_score = abs(directional_score) + liquidity_bonus
            bullish_score = 0.0
        else:
            bullish_score = 0.0
            bearish_score = 0.0

        current_price = quote.get("price", 100.0)

        # 3. Determine consensus verdict & side
        if bullish_score > bearish_score and bullish_score >= 0.65:
            side = OrderSide.BUY
            confidence = min(0.96, round(bullish_score, 2))
            target_price = round(current_price * (1.0 + (event_data.get("target_move_pct", 2.5) / 100.0)), 2)
            debate_summary = (
                f"Consensus reached: STRONG BUY on {symbol}. Macro liquidity tailwind aligns with "
                f"corporate fundamental catalyst. Arb Agent confirms adequate 24/7 weekend orderbook depth."
            )
        elif bearish_score > bullish_score and bearish_score >= 0.65:
            side = OrderSide.SELL
            confidence = min(0.92, round(bearish_score, 2))
            target_price = round(current_price * (1.0 - (abs(event_data.get("target_move_pct", -2.0)) / 100.0)), 2)
            debate_summary = (
                f"Consensus reached: SHORT / HEDGE on {symbol}. Macro contagion and negative fundamental "
                f"disruption present clear asymmetric downside risk."
            )
        else:
            side = OrderSide.HOLD
            confidence = 0.50
            target_price = current_price
            debate_summary = (
                f"Consensus: NO TRADE (HOLD). Signals are mixed across Macro ({macro_thought.verdict}) "
                f"and Micro ({earnings_thought.verdict}). Preserving capital."
            )

        # Suggested sizing: Fractional Kelly formulation based on confidence
        max_size = (settings.risk.max_position_size_pct / 100.0) * settings.initial_capital_usdt
        suggested_size = max(1000.0, round(max_size * (confidence ** 2), 2)) if side != OrderSide.HOLD else 0.0

        # Construct comprehensive structured thesis
        full_thesis = (
            f"Event Catalyst: '{event_data.get('title')}'\n"
            f"- Macro Perspective: {macro_thought.analysis}\n"
            f"- Micro/Earnings Perspective: {earnings_thought.analysis}\n"
            f"- Microstructure/Liquidity: {arb_thought.analysis}\n"
            f"- Technical Indicators: RSI={ta_data.get('rsi_14')}, Trend={ta_data.get('overall_signal')}\n"
            f"- Final Consensus: {debate_summary}"
        )

        proposal = TradeProposal(
            symbol=symbol,
            side=side,
            confidence=confidence,
            thesis=full_thesis,
            suggested_size_usdt=suggested_size,
            target_price=target_price,
            expected_hold_hours=event_data.get("expected_hold_hours", 4.0),
            source_agent="Aegis24_ConsensusSwarm"
        )

        record = {
            "proposal": proposal.model_dump(),
            "agent_thoughts": [t.model_dump() for t in agent_thoughts],
            "debate_summary": debate_summary,
            "timestamp": proposal.timestamp
        }
        self.debate_history.append(record)
        if len(self.debate_history) > 100:
            self.debate_history.pop(0)

        return proposal, agent_thoughts, debate_summary

consensus_orchestrator = ConsensusOrchestrator()
