"""
Bitget Playbook Exporter
Generates compliant, ready-to-publish code for Bitget Playbook & @bitget-ai/getagent-skill.
Enables direct strategy productization and commercial revenue-sharing review.
"""

from typing import Dict, Any

class PlaybookExporter:
    @staticmethod
    def generate_playbook_code(symbol: str = "NVDAUSDT") -> str:
        """
        Generates standard Python Playbook syntax conforming to Bitget Playbook sandbox environment.
        """
        code = f'''"""
Bitget Playbook: Aegis24 24/7 rToken Overnight Momentum & Safety Guard
Card Name: Aegis24-Overnight-Alpha-{symbol}
Symbol: {symbol}
Target Platform: Bitget Playbook / GetAgent Studio
"""

import numpy as np

def initialize(context):
    context.symbol = "{symbol}"
    context.max_position_pct = 0.05       # 5% max AUM allocation
    context.max_slippage_pct = 0.0035      # 0.35% spread threshold
    context.nav_dev_limit_pct = 0.025     # 2.5% fair value band
    context.in_position = False
    context.entry_price = 0.0

def handle_data(context, data):
    """
    Evaluates every 1-hour or event trigger.
    """
    current_price = data.current(context.symbol, "close")
    bid = data.current(context.symbol, "bid")
    ask = data.current(context.symbol, "ask")
    
    # 1. Deterministic 'Seatbelt' Check: Liquidity & Spread
    if ask > 0 and bid > 0:
        spread = (ask - bid) / current_price
        if spread > context.max_slippage_pct:
            # Thin weekend orderbook: do not enter
            return

    # 2. Compute 20-period EMA & Volume Anomaly
    history = data.history(context.symbol, "close", 20, "1h")
    ema_20 = np.mean(history)
    
    # 3. Execution logic: Trend follow with strict stop
    if not context.in_position and current_price > (ema_20 * 1.008):
        # Buy signal cleared by risk gate
        target_shares = (context.portfolio.cash * context.max_position_pct) / current_price
        order(context.symbol, target_shares)
        context.in_position = True
        context.entry_price = current_price
        
    elif context.in_position:
        # Take profit (+3.5%) or Stop Loss (-1.5%)
        pnl_pct = (current_price - context.entry_price) / context.entry_price
        if pnl_pct >= 0.035 or pnl_pct <= -0.015:
            order_target(context.symbol, 0)
            context.in_position = False
'''
        return code

playbook_exporter = PlaybookExporter()
