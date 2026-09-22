"""
Deterministic Risk Harness: Rule Invariants & Data Models
Zero-Discretion Execution Gatekeeper
"""

import time
import uuid
import hashlib
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class OrderSide(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"

class TradeProposal(BaseModel):
    proposal_id: str = Field(default_factory=lambda: f"prop_{uuid.uuid4().hex[:8]}")
    symbol: str
    side: OrderSide
    confidence: float = Field(ge=0.0, le=1.0, description="Agent consensus confidence score")
    thesis: str = Field(description="Explanatory rationale from multi-agent debate")
    suggested_size_usdt: float
    target_price: float
    expected_hold_hours: float = 4.0
    timestamp: float = Field(default_factory=time.time)
    source_agent: str = "ConsensusSwarm"

class RiskCheckStatus(str, Enum):
    PASSED = "PASSED"
    REJECTED = "REJECTED"
    WARNING = "WARNING"

class SingleRiskCheck(BaseModel):
    name: str
    status: RiskCheckStatus
    threshold: str
    observed_value: str
    reason: str

class RiskEvaluationReport(BaseModel):
    evaluation_id: str = Field(default_factory=lambda: f"risk_{uuid.uuid4().hex[:8]}")
    proposal_id: str
    symbol: str
    approved: bool
    checks: list[SingleRiskCheck]
    approved_size_usdt: float = 0.0
    execution_price: float = 0.0
    risk_hash: str = ""
    timestamp: float = Field(default_factory=time.time)

    def compute_hash(self) -> str:
        raw = f"{self.evaluation_id}:{self.proposal_id}:{self.approved}:{self.approved_size_usdt}:{self.timestamp}"
        return hashlib.sha256(raw.encode()).hexdigest()[:16]

class ExecutedOrder(BaseModel):
    order_id: str = Field(default_factory=lambda: f"ord_{uuid.uuid4().hex[:8]}")
    proposal_id: str
    evaluation_id: str
    symbol: str
    side: OrderSide
    fill_price: float
    size_usdt: float
    shares: float
    slippage_pct: float
    risk_hash: str
    timestamp: float = Field(default_factory=time.time)
    order_status: str = "FILLED"
    pnl_usdt: float = 0.0
    unrealized_pnl_pct: float = 0.0
