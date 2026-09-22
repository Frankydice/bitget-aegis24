"""
Base Agent Module for Aegis24 Multi-Agent Swarm
Supports Bitget Qwen API (https://hackathon.bitgetops.com/v1) with resilient local cognitive reasoning.
"""

import httpx
from typing import Dict, Any, Optional
from pydantic import BaseModel
from backend.config import settings

class AgentThought(BaseModel):
    agent_name: str
    role: str
    observation: str
    analysis: str
    verdict: str  # BULLISH, BEARISH, NEUTRAL, ARB_OPPORTUNITY
    confidence: float
    key_metrics: Dict[str, Any]

class BaseAgent:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
        self.client = httpx.AsyncClient(timeout=3.0)

    async def query_llm(self, prompt: str, system_prompt: str) -> Optional[str]:
        """
        Queries Alibaba Qwen endpoint provided by Bitget Hackathon if API key is present.
        """
        if not settings.bitget_qwen_api_key:
            return None

        headers = {
            "Authorization": f"Bearer {settings.bitget_qwen_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.llm_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }

        try:
            resp = await self.client.post(
                f"{settings.bitget_qwen_base_url}/chat/completions",
                headers=headers,
                json=payload
            )
            if resp.status_code == 200:
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except Exception:
            return None
        return None
