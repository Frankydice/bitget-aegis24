"""
24/7 Weekend & Overnight Event Feed Simulator
Allows interactive injection and realistic continuous streaming of overnight information shocks.
"""

import time
from typing import List, Dict, Any

PRESET_EVENTS = [
    {
        "id": "evt_weekend_fed_cut",
        "title": "Fed Chair Emergency Weekend Statement",
        "content": "Federal Reserve Chair signals a dovish 50bps rate cut bias in unscheduled remarks, citing cooling wage inflation and robust liquidity conditions.",
        "category": "Macro / Monetary",
        "affected_symbols": ["SPYUSDT", "NVDAUSDT", "AAPLUSDT"],
        "implied_bias": "STRONG_BULLISH",
        "target_move_pct": 2.8
    },
    {
        "id": "evt_nvda_hyperscaler",
        "title": "Hyperscaler Consortium Announces $80B Accelerated GPU CapEx",
        "content": "Microsoft, Amazon, and Meta jointly disclose an accelerated 2027 CapEx roadmap, locking in supply contracts exclusively for next-gen Nvidia Blackwell Ultra platforms.",
        "category": "Tech / Earnings",
        "affected_symbols": ["NVDAUSDT", "MSFTUSDT"],
        "implied_bias": "STRONG_BULLISH",
        "target_move_pct": 4.5
    },
    {
        "id": "evt_tsla_robotaxi",
        "title": "TSLA Full Self-Driving Regulatory Clearance",
        "content": "National Highway Traffic Safety Administration grants preliminary multi-state commercial approval for Tesla autonomous CyberCab fleet operations starting Q4.",
        "category": "Disruptive Tech",
        "affected_symbols": ["TSLAUSDT"],
        "implied_bias": "BULLISH",
        "target_move_pct": 5.2
    },
    {
        "id": "evt_crypto_surge",
        "title": "Weekend BTC Liquidity Spike & Institutional Inflow",
        "content": "Global macro hedge funds deploy $2.4B into digital asset reserves over Saturday night, driving cross-asset beta into high-growth crypto-equity proxies.",
        "category": "Cross-Asset / Crypto",
        "affected_symbols": ["MSTRUSDT", "SPYUSDT"],
        "implied_bias": "BULLISH",
        "target_move_pct": 6.8
    },
    {
        "id": "evt_geopolitical_shock",
        "title": "Middle-East Maritime Shipping Corridor Disruption",
        "content": "Hostilities disrupt Red Sea maritime logistics channels over the weekend, driving crude oil +4% and sparking risk-off sentiment in transport and consumer discretionary.",
        "category": "Geopolitical / Risk-Off",
        "affected_symbols": ["SPYUSDT", "TSLAUSDT"],
        "implied_bias": "BEARISH",
        "target_move_pct": -2.1
    }
]

class EventFeedSimulator:
    def __init__(self):
        self.events = PRESET_EVENTS.copy()

    def get_preset_events(self) -> List[Dict[str, Any]]:
        return self.events

    def get_event_by_id(self, event_id: str) -> Dict[str, Any]:
        for e in self.events:
            if e["id"] == event_id:
                return e
        return self.events[0]

event_simulator = EventFeedSimulator()
