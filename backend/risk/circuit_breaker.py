"""
Portfolio Circuit Breaker
Protects the Agentic Sub-Account from catastrophic intraday drawdown.
"""

import time
from typing import Optional
from backend.config import settings

class CircuitBreaker:
    def __init__(self, max_drawdown_pct: float = settings.risk.max_daily_drawdown_pct):
        self.max_drawdown_pct = max_drawdown_pct
        self.day_start_timestamp = time.time()
        self.day_start_equity = settings.initial_capital_usdt
        self.current_equity = settings.initial_capital_usdt
        self.high_watermark = settings.initial_capital_usdt
        self.tripped = False
        self.tripped_at: Optional[float] = None
        self.trip_reason: Optional[str] = None

    def update_equity(self, current_equity: float):
        self.current_equity = current_equity
        if current_equity > self.high_watermark:
            self.high_watermark = current_equity
            
        # Daily drawdown from start of day
        drawdown_pct = ((self.day_start_equity - current_equity) / self.day_start_equity) * 100.0
        
        if drawdown_pct >= self.max_drawdown_pct:
            self.tripped = True
            self.tripped_at = time.time()
            self.trip_reason = f"Daily drawdown reached {drawdown_pct:.2f}% (Limit: {self.max_drawdown_pct:.2f}%)"
            
    def is_active(self) -> bool:
        return self.tripped

    def get_status(self) -> dict:
        drawdown_pct = max(0.0, ((self.day_start_equity - self.current_equity) / self.day_start_equity) * 100.0)
        return {
            "tripped": self.tripped,
            "current_drawdown_pct": round(drawdown_pct, 3),
            "max_limit_pct": self.max_drawdown_pct,
            "day_start_equity": round(self.day_start_equity, 2),
            "current_equity": round(self.current_equity, 2),
            "high_watermark": round(self.high_watermark, 2),
            "trip_reason": self.trip_reason,
            "status": "HALTED" if self.tripped else "NORMAL"
        }

    def reset_day(self, new_equity: Optional[float] = None):
        self.day_start_timestamp = time.time()
        if new_equity is not None:
            self.current_equity = new_equity
        self.day_start_equity = self.current_equity
        self.tripped = False
        self.tripped_at = None
        self.trip_reason = None

circuit_breaker = CircuitBreaker()
