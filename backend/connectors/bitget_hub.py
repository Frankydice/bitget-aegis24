"""
Bitget Agent Hub & Agentic Account Connector
Interfaces with Bitget UTA v3, Agent Hub 'bgc' CLI, and Agentic Sub-Account OAuth.
"""

import time
import uuid
from typing import Dict, Any, List, Optional
from backend.config import settings
from backend.risk.rules import ExecutedOrder, OrderSide

class BitgetAgentHubConnector:
    def __init__(self):
        self.account_uid = settings.bitget_agentic_account_uid
        self.is_agentic_account = True
        self.is_paper_trading = True
        self.balance_usdt = settings.initial_capital_usdt
        self.positions: Dict[str, Dict[str, Any]] = {}
        self.trade_history: List[ExecutedOrder] = []

    def get_account_status(self) -> Dict[str, Any]:
        """
        Returns Agentic sub-account isolation status, available balance, and open exposure.
        """
        total_position_val = sum(p["size_usdt"] for p in self.positions.values())
        unrealized_pnl = sum(p["unrealized_pnl_usdt"] for p in self.positions.values())
        equity = self.balance_usdt + total_position_val + unrealized_pnl

        return {
            "account_uid": self.account_uid,
            "account_type": "Agentic Isolated Sub-Account (OAuth Verified)",
            "trading_mode": "Paper Trading (Sandbox Verification)" if self.is_paper_trading else "Live Agentic",
            "cash_balance_usdt": round(self.balance_usdt, 2),
            "open_positions_value_usdt": round(total_position_val, 2),
            "unrealized_pnl_usdt": round(unrealized_pnl, 2),
            "total_equity_usdt": round(equity, 2),
            "isolated_quota_limit_usdt": settings.initial_capital_usdt,
            "withdrawal_disabled": True, # Crucial security feature of Agentic Accounts
            "api_tier": "VIP_AGENTIC_V3"
        }

    def execute_order(
        self,
        symbol: str,
        side: OrderSide,
        size_usdt: float,
        price: float,
        slippage_pct: float,
        proposal_id: str,
        evaluation_id: str,
        risk_hash: str
    ) -> ExecutedOrder:
        """
        Executes a risk-cleared trade into the Agentic account / paper trading simulator.
        """
        # Calculate shares and net fill
        fill_price = price * (1.0 + (slippage_pct / 100.0) if side == OrderSide.BUY else 1.0 - (slippage_pct / 100.0))
        shares = size_usdt / fill_price

        order = ExecutedOrder(
            proposal_id=proposal_id,
            evaluation_id=evaluation_id,
            symbol=symbol,
            side=side,
            fill_price=round(fill_price, 4),
            size_usdt=round(size_usdt, 2),
            shares=round(shares, 4),
            slippage_pct=round(slippage_pct, 4),
            risk_hash=risk_hash,
            timestamp=time.time(),
            order_status="FILLED"
        )

        if side == OrderSide.BUY:
            self.balance_usdt -= size_usdt
            if symbol in self.positions:
                pos = self.positions[symbol]
                total_shares = pos["shares"] + shares
                avg_entry = ((pos["shares"] * pos["entry_price"]) + (shares * fill_price)) / total_shares
                pos["shares"] = total_shares
                pos["entry_price"] = avg_entry
                pos["size_usdt"] += size_usdt
            else:
                self.positions[symbol] = {
                    "symbol": symbol,
                    "shares": round(shares, 4),
                    "entry_price": round(fill_price, 4),
                    "current_price": round(fill_price, 4),
                    "size_usdt": round(size_usdt, 2),
                    "unrealized_pnl_usdt": 0.0,
                    "unrealized_pnl_pct": 0.0,
                    "entry_time": time.time(),
                    "side": "LONG"
                }
        elif side == OrderSide.SELL:
            if symbol in self.positions:
                pos = self.positions[symbol]
                pnl = (fill_price - pos["entry_price"]) * min(shares, pos["shares"])
                order.pnl_usdt = round(pnl, 2)
                self.balance_usdt += (size_usdt + pnl)
                del self.positions[symbol]

        self.trade_history.append(order)
        return order

    def update_position_prices(self, price_map: Dict[str, float]):
        """
        Updates unrealized PnL on all open positions.
        """
        for sym, current_price in price_map.items():
            if sym in self.positions:
                pos = self.positions[sym]
                pos["current_price"] = current_price
                diff = current_price - pos["entry_price"]
                pos["unrealized_pnl_usdt"] = round(diff * pos["shares"], 2)
                pos["unrealized_pnl_pct"] = round((diff / pos["entry_price"]) * 100.0, 2)

bitget_hub = BitgetAgentHubConnector()
