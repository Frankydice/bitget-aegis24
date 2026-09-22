"""
Aegis24 System Configuration
Bitget AI x Crypto Hackathon Season 2 (Track 2: Agentic Trading)
"""

import os
from pydantic import BaseModel, Field

class RiskLimits(BaseModel):
    # Deterministic Pre-Trade Safety Harness ("The Seatbelt") Invariants
    max_slippage_pct: float = Field(default=0.35, description="Max acceptable spread/slippage in percentage")
    max_nav_deviation_pct: float = Field(default=2.50, description="Max acceptable deviation from synthetic NAV")
    max_position_size_pct: float = Field(default=5.00, description="Max allocation per single position (% of AUM)")
    max_daily_drawdown_pct: float = Field(default=2.00, description="Daily portfolio drawdown limit to trigger circuit breaker")
    max_portfolio_leverage: float = Field(default=1.00, description="Max portfolio leverage (1.0 = spot/no margin)")
    monday_open_unwind_minutes: int = Field(default=30, description="Minutes before 9:30 AM EST to initiate pre-market de-risking")

class Settings(BaseModel):
    # App Config
    app_name: str = "Aegis24 Agentic Desk"
    version: str = "2.0.0-s2"
    debug: bool = os.getenv("DEBUG", "False").lower() in ("true", "1")
    port: int = int(os.getenv("PORT", "8000"))
    
    # Bitget Ecosystem Endpoints
    bitget_mcp_url: str = os.getenv("BITGET_MCP_URL", "https://agent.bitget.com/mcp")
    bitget_qwen_base_url: str = os.getenv("BITGET_QWEN_BASE_URL", "https://hackathon.bitgetops.com/v1")
    bitget_qwen_api_key: str = os.getenv("BITGET_QWEN_API_KEY", "")
    bitget_agentic_account_uid: str = os.getenv("BITGET_UID", "DEMO_AGENTIC_SUB_88921")
    
    # Model config
    llm_model: str = os.getenv("LLM_MODEL", "qwen3.8-max")
    
    # Capital & Portfolio
    initial_capital_usdt: float = 100_000.0
    
    # Active rTokens supported in 24/7 continuous trading
    supported_rtokens: list[str] = [
        "NVDAUSDT",
        "TSLAUSDT",
        "AAPLUSDT",
        "SPYUSDT",
        "MSTRUSDT",
        "MSFTUSDT",
        "AMZNUSDT"
    ]
    
    # Risk Configuration
    risk: RiskLimits = RiskLimits()

settings = Settings()
