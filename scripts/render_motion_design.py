import os
import sys
import math
import time
import subprocess
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageDraw, ImageFont

FFMPEG_EXE = r"C:\Users\HomePC\AppData\Local\Programs\Python\Python313\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
AUDIO_FILE = "aegis24_voiceover.mp3"
OUTPUT_VIDEO = "aegis24_motion_design_showcase.mp4"

WIDTH = 1920
HEIGHT = 1080
FPS = 15

SECTORS = [
    {"id": 1, "name": "The 65-Hour Market Darkness", "sub": "Continuous Off-Hours Volatility Without Human Delay", "dur": 26.04},
    {"id": 2, "name": "24/7 rToken Orderbook Discovery", "sub": "Bitget Model Context Protocol & Micro-Spread Corridors", "dur": 23.06},
    {"id": 3, "name": "Weekend Shock Injection Terminal", "sub": "Autonomous Ingestion of Breaking Macro & Tech Catalysts", "dur": 20.09},
    {"id": 4, "name": "Cognitive Swarm Deliberation", "sub": "Qwen Multi-Agent Consensus Debate & Conviction Sizing", "dur": 17.11},
    {"id": 5, "name": "5 Deterministic Safety Gates", "sub": "Zero-Discretion Hardware Seatbelt & Cryptographic Risk Hash", "dur": 24.79},
    {"id": 6, "name": "Execution Alpha & Audited Trajectory", "sub": "+19.64% 60-Day Return · 2.34 Sharpe · Alpha Over SPY +15.52%", "dur": 27.22}
]

curr = 0.0
for s in SECTORS:
    s["start"] = curr
    curr += s["dur"]
    s["end"] = curr
TOTAL_DURATION = curr

def get_fonts():
    try:
        font_huge = ImageFont.truetype("arialbd.ttf", 64)
        font_title = ImageFont.truetype("arialbd.ttf", 42)
        font_sub = ImageFont.truetype("arialbd.ttf", 24)
        font_body = ImageFont.truetype("arial.ttf", 20)
        font_mono_lg = ImageFont.truetype("consola.ttf", 38)
        font_mono = ImageFont.truetype("consolab.ttf", 22)
        font_mono_sm = ImageFont.truetype("consola.ttf", 16)
        font_pill = ImageFont.truetype("arialbd.ttf", 15)
    except:
        font_huge = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_body = ImageFont.load_default()
        font_mono_lg = ImageFont.load_default()
        font_mono = ImageFont.load_default()
        font_mono_sm = ImageFont.load_default()
        font_pill = ImageFont.load_default()
    return {
        "huge": font_huge,
        "title": font_title,
        "sub": font_sub,
        "body": font_body,
        "mono_lg": font_mono_lg,
        "mono": font_mono,
        "mono_sm": font_mono_sm,
        "pill": font_pill
    }

FONTS = get_fonts()

def draw_pill(draw, x, y, text, border_color, fill_color, text_color, font, dot_color=None):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pw = tw + 40 + (16 if dot_color else 0)
    ph = 36
    px = x - pw // 2
    py = y - ph // 2
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=ph // 2, fill=fill_color, outline=border_color, width=1)
    
    start_tx = px + 20
    if dot_color:
        draw.ellipse([start_tx, py + ph // 2 - 4, start_tx + 8, py + ph // 2 + 4], fill=dot_color)
        start_tx += 16
    draw.text((start_tx, py + 8), text, fill=text_color, font=font)

def draw_card(draw, x, y, w, h, fill="#0c0d12", outline="#27272a", radius=16):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=radius, fill=fill, outline=outline, width=1)

def render_frame(t, frame_idx):
    img = Image.new("RGB", (WIDTH, HEIGHT), "#020306")
    draw = ImageDraw.Draw(img)

    # 1. High-Tech Grid with subtle coordinate markers
    for gx in range(0, WIDTH, 120):
        draw.line([(gx, 0), (gx, HEIGHT)], fill="#080b14", width=1)
    for gy in range(0, HEIGHT, 120):
        draw.line([(0, gy), (WIDTH, gy)], fill="#080b14", width=1)

    # 2. Sleek Horizon Wave (positioned safely near top and bottom)
    wave1 = math.sin(t * 1.5) * 15
    wave2 = math.cos(t * 1.8) * 20
    top_beam = [
        (0, int(155 + wave1)),
        (int(WIDTH * 0.3), int(160 + wave2)),
        (int(WIDTH * 0.7), int(150 - wave1)),
        (WIDTH, int(165 + wave2))
    ]
    for seg in range(len(top_beam) - 1):
        draw.line([top_beam[seg], top_beam[seg + 1]], fill="#0e2a47", width=2)
        p1 = (top_beam[seg][0], top_beam[seg][1] + 2)
        p2 = (top_beam[seg + 1][0], top_beam[seg + 1][1] + 2)
        draw.line([p1, p2], fill="#00e5ff", width=1)

    # Floating Starlight Particles
    for i in range(20):
        px = int((i * 155.0 + t * 35) % WIDTH)
        py = int((i * 110.0 + math.sin(t * 1.8 + i) * 50) % (HEIGHT * 0.8) + HEIGHT * 0.1)
        c = "#3b82f6" if i % 2 == 0 else "#ffffff"
        r = 1 if i % 3 != 0 else 2
        draw.ellipse([px - r, py - r, px + r, py + r], fill=c)

    # 3. Persistent Top Telemetry Bar
    draw.text((90, 52), "AEGIS24", fill="#ffffff", font=FONTS["title"])
    draw.text((310, 68), "· 24/7 Autonomous rToken Agent Desk · Bitget S2", fill="#71717a", font=FONTS["body"])
    
    # Active Sector Identification
    curr_sector = SECTORS[0]
    for s in SECTORS:
        if s["start"] <= t < s["end"]:
            curr_sector = s
            break
    
    sec_tag = f"SECTOR 0{curr_sector['id']} / 06  ·  {curr_sector['name'].upper()}"
    draw_pill(draw, WIDTH - 280, 68, sec_tag, "#1e3a8a", "#070e1e", "#93c5fd", FONTS["pill"], "#3b82f6")

    # Timecode readout
    tc_min = int(t // 60)
    tc_sec = int(t % 60)
    tc_ms = int((t % 1) * 100)
    tc_str = f"TIMECODE: {tc_min:02d}:{tc_sec:02d}.{tc_ms:02d} / 02:18.36"
    draw.text((WIDTH - 360, 105), tc_str, fill="#52525b", font=FONTS["mono_sm"])

    sec_t = t - curr_sector["start"]
    sec_prog = min(1.0, sec_t / curr_sector["dur"])

    # ==============================================================
    # SECTOR 1: THE 65-HOUR MARKET DARKNESS & THESIS
    # ==============================================================
    if curr_sector["id"] == 1:
        draw_pill(draw, WIDTH // 2, 260, "24/7 AUTONOMOUS RTOKEN AGENT DESK", "#1d4ed8", "#081329", "#60a5fa", FONTS["pill"], "#3b82f6")

        hl1 = "When US equities trade 24/7."
        hl2 = "Humans sleep, agents don't."
        b1 = FONTS["huge"].getbbox(hl1)
        b2 = FONTS["huge"].getbbox(hl2)
        draw.text((WIDTH // 2 - (b1[2] - b1[0]) // 2, 320), hl1, fill="#ffffff", font=FONTS["huge"])
        draw.text((WIDTH // 2 - (b2[2] - b2[0]) // 2, 410), hl2, fill="#a1a1aa", font=FONTS["huge"])

        sub = "Aegis24 turns continuous tokenized US equity orderbooks into a coordinated strategy,"
        sub2 = "with a deterministic hardware seatbelt when real life gets in the way."
        draw.text((WIDTH // 2 - 470, 520), sub, fill="#d4d4d8", font=FONTS["body"])
        draw.text((WIDTH // 2 - 380, 555), sub2, fill="#d4d4d8", font=FONTS["body"])

        cards = [
            ("65 CONSECUTIVE HOURS", "Traditional markets go dark Friday 4 PM EST, blindsiding manual traders during off-hours.", "#f43f5e"),
            ("WEEKEND GAP RISK", "Sunday geopolitical and macro shocks bypass traditional limit orders completely.", "#f59e0b"),
            ("AUTONOMOUS DESK", "Zero-discretion hardware invariants protect capital while humans sleep.", "#10b981")
        ]
        for i, (ctitle, cdesc, ccolor) in enumerate(cards):
            cx = 180 + i * 540
            cy = 660
            draw_card(draw, cx, cy, 480, 240, fill="#08090e", outline=ccolor)
            draw.text((cx + 35, cy + 35), ctitle, fill=ccolor, font=FONTS["mono"])
            words = cdesc.split()
            l1 = " ".join(words[:7])
            l2 = " ".join(words[7:])
            draw.text((cx + 35, cy + 95), l1, fill="#e4e4e7", font=FONTS["body"])
            draw.text((cx + 35, cy + 130), l2, fill="#e4e4e7", font=FONTS["body"])

    # ==============================================================
    # SECTOR 2: CONTINUOUS 24/7 rTOKEN ORDERBOOK DISCOVERY
    # ==============================================================
    elif curr_sector["id"] == 2:
        draw.text((120, 180), "24/7 Synthetic rToken Microstructure", fill="#ffffff", font=FONTS["huge"])
        draw.text((120, 255), "Real-time Bitget MCP orderbook streaming · Bid-Ask spreads · Synthetic NAV parity", fill="#a1a1aa", font=FONTS["sub"])

        tickers = [
            ("rNVDA", 128.45 + math.sin(t * 3) * 0.2, "+3.42%", "0.11%", "99.96%", True),
            ("rTSLA", 242.10 + math.cos(t * 2.5) * 0.3, "+5.18%", "0.14%", "99.94%", True),
            ("rAAPL", 228.60 + math.sin(t * 2) * 0.15, "+1.15%", "0.08%", "99.98%", True),
            ("rMSTR", 345.80 + math.sin(t * 1.5) * 0.6, "+8.92%", "0.58%", "99.42%", False),
        ]
        for i, (sym, price, chg, spread, nav, is_safe) in enumerate(tickers):
            tx = 120 + i * 425
            ty = 320
            card_border = "#10b981" if is_safe else "#f43f5e"
            draw_card(draw, tx, ty, 395, 540, fill="#08090e", outline=card_border)
            
            draw.text((tx + 28, ty + 28), sym, fill="#ffffff", font=FONTS["title"])
            draw.text((tx + 270, ty + 38), chg, fill="#10b981" if chg.startswith("+") else "#f43f5e", font=FONTS["mono"])

            draw.text((tx + 28, ty + 105), f"${price:.2f}", fill="#ffffff", font=FONTS["mono_lg"])
            draw.text((tx + 28, ty + 165), f"NAV PARITY: {nav}", fill="#71717a", font=FONTS["mono_sm"])

            draw.text((tx + 28, ty + 215), "ORDERBOOK DEPTH STREAM", fill="#a1a1aa", font=FONTS["mono_sm"])
            draw_card(draw, tx + 28, ty + 245, 339, 130, fill="#030407", outline="#18181b")

            bid_w = int(220 + math.sin(t * 4 + i) * 35)
            ask_w = int(190 + math.cos(t * 4 + i) * 30)
            draw.rectangle([tx + 36, ty + 260, tx + 36 + bid_w, ty + 295], fill="#064e3b")
            draw.text((tx + 46, ty + 268), f"BID 128.38 · ${bid_w*200:,} USDT", fill="#6ee7b7", font=FONTS["mono_sm"])

            draw.rectangle([tx + 36, ty + 310, tx + 36 + ask_w, ty + 345], fill="#7f1d1d")
            draw.text((tx + 46, ty + 318), f"ASK 128.52 · ${ask_w*200:,} USDT", fill="#fca5a5", font=FONTS["mono_sm"])

            stamp_bg = "#064e3b" if is_safe else "#450a0a"
            stamp_fg = "#34d399" if is_safe else "#f87171"
            stamp_txt = f"SPREAD: {spread} [GATE 2 PASS]" if is_safe else f"SPREAD: {spread} [SEATBELT VETO]"
            draw.rounded_rectangle([tx + 28, ty + 430, tx + 367, ty + 490], radius=10, fill=stamp_bg)
            draw.text((tx + 45, ty + 450), stamp_txt, fill=stamp_fg, font=FONTS["mono_sm"])

    # ==============================================================
    # SECTOR 3: WEEKEND SHOCK INJECTION TERMINAL
    # ==============================================================
    elif curr_sector["id"] == 3:
        ripple_r = int((sec_t * 160) % 550)
        draw.ellipse([WIDTH // 2 - ripple_r, 540 - ripple_r, WIDTH // 2 + ripple_r, 540 + ripple_r], outline="#0e3a5a", width=2)
        if ripple_r > 100:
            draw.ellipse([WIDTH // 2 - (ripple_r - 100), 540 - (ripple_r - 100), WIDTH // 2 + (ripple_r - 100), 540 + (ripple_r - 100)], outline="#00e5ff", width=1)

        draw_pill(draw, WIDTH // 2, 210, "SUNDAY 03:14 UTC · BREAKING CATALYST INGESTED", "#f43f5e", "#28070e", "#fca5a5", FONTS["mono"], "#f43f5e")

        draw_card(draw, WIDTH // 2 - 620, 260, 1240, 600, fill="#0a0a0f", outline="#3b82f6")

        draw.text((WIDTH // 2 - 560, 310), "TSMC Weekend Wafer Yield Breakthrough", fill="#ffffff", font=FONTS["title"])
        draw.text((WIDTH // 2 - 560, 380), "Sunday press conference in Taipei confirms unexpected +18% fabrication yield improvement on Blackwell 3nm nodes.", fill="#93c5fd", font=FONTS["sub"])
        draw.text((WIDTH // 2 - 560, 425), "Autonomous intelligence instantly parses supply implications for NVDA and hyperscaler CapEx commitments.", fill="#71717a", font=FONTS["body"])

        tiles = [
            ("TARGET ASSET", "NVDAUSDT", "#ffffff"),
            ("DIRECTIONAL BIAS", "STRONG BULLISH", "#10b981"),
            ("EXPECTED VOL MOVE", "+4.20%", "#3b82f6"),
            ("ORDERBOOK DEPTH", "$65,000 USDT", "#f59e0b")
        ]
        for i, (lbl, val, col) in enumerate(tiles):
            bx = WIDTH // 2 - 560 + i * 285
            by = 495
            draw_card(draw, bx, by, 260, 150, fill="#040508", outline="#27272a")
            draw.text((bx + 20, by + 25), lbl, fill="#71717a", font=FONTS["mono_sm"])
            draw.text((bx + 20, by + 75), val, fill=col, font=FONTS["mono"])

        draw.text((WIDTH // 2 - 320, 725), ">> Routing catalyst to Qwen Cognitive Swarm Deliberation...", fill="#60a5fa", font=FONTS["mono"])

    # ==============================================================
    # SECTOR 4: COGNITIVE SWARM DELIBERATION
    # ==============================================================
    elif curr_sector["id"] == 4:
        draw.text((120, 180), "Qwen Cognitive Swarm Deliberation", fill="#ffffff", font=FONTS["huge"])
        draw.text((120, 255), "Multi-agent domain specialists debating macro regime, earnings revisions, and microstructure", fill="#a1a1aa", font=FONTS["sub"])

        agents = [
            ("Macro Regime Analyst", "Dovish rate posture + DXY softening validates equity risk-on momentum.", "92% BULLISH", "#38bdf8"),
            ("Earnings & Fundamental Auditor", "TSMC 18% yield improvement expands Blackwell GPU margins & revenue model.", "96% BUY", "#4ade80"),
            ("Microstructure Guard", "Continuous orderbook spread at 0.11% with sufficient absorption capacity.", "91% PASS", "#facc15"),
            ("Valuation & Parity Auditor", "Trading within 0.05% of synthetic NAV parity. No toxic dislocation.", "94% FAIR", "#c084fc")
        ]
        for i, (aname, adesc, aconf, acol) in enumerate(agents):
            ay = 330 + i * 130
            draw_card(draw, 120, ay, 1020, 110, fill="#08090e", outline=acol)
            draw.text((150, ay + 20), aname, fill=acol, font=FONTS["mono"])
            draw.text((150, ay + 60), adesc, fill="#d4d4d8", font=FONTS["body"])
            draw.text((950, ay + 35), aconf, fill=acol, font=FONTS["mono"])

        gx = 1190
        gy = 330
        draw_card(draw, gx, gy, 610, 500, fill="#060c18", outline="#3b82f6")
        draw.text((gx + 40, gy + 45), "SWARM CONSENSUS VERDICT", fill="#60a5fa", font=FONTS["mono"])
        draw.text((gx + 40, gy + 110), "UNANIMOUS BUY", fill="#ffffff", font=FONTS["huge"])
        
        conv_pct = min(0.94, 0.40 + sec_prog * 0.60)
        draw.rectangle([gx + 40, gy + 210, gx + 550, gy + 245], fill="#18181b")
        draw.rectangle([gx + 40, gy + 210, gx + 40 + int(510 * conv_pct), gy + 245], fill="#3b82f6")

        draw.text((gx + 40, gy + 275), f"Conviction Score: {int(conv_pct*100)}%", fill="#ffffff", font=FONTS["title"])
        draw.text((gx + 40, gy + 350), "• Sizing Model: $3,500 USDT (3.5% Isolated AUM)", fill="#a1a1aa", font=FONTS["body"])
        draw.text((gx + 40, gy + 395), "• Target Objective: $134.20 (+4.47% Upside)", fill="#a1a1aa", font=FONTS["body"])

    # ==============================================================
    # SECTOR 5: 5 DETERMINISTIC SAFETY GATES
    # ==============================================================
    elif curr_sector["id"] == 5:
        draw.text((120, 180), "Deterministic Safety Harness (5 Gates)", fill="#ffffff", font=FONTS["huge"])
        draw.text((120, 255), "Zero LLM execution discretion · Mathematical invariants enforced prior to order placement", fill="#a1a1aa", font=FONTS["sub"])

        gates = [
            ("GATE 01", "CircuitBreakerCheck", "Daily Portfolio Drawdown < 2.0%", "Observed: 0.12%", "[ PASSED ]"),
            ("GATE 02", "LiquiditySpreadCheck", "Orderbook Spread <= 0.35%", "Observed: 0.11%", "[ PASSED ]"),
            ("GATE 03", "FairValueDeviationCheck", "Synthetic NAV Deviation <= 2.50%", "Observed: 0.04%", "[ PASSED ]"),
            ("GATE 04", "PositionSizingCheck", "Max Subaccount Quota <= $5,000 USDT", "Observed: $3,500 USDT", "[ PASSED ]"),
            ("GATE 05", "MarketOpenDeRiskCheck", "Freeze 30m Prior to 9:30 AM NYSE Bell", "Safe Weekend Window", "[ PASSED ]")
        ]
        for i, (gnum, gname, glimit, gobs, gstat) in enumerate(gates):
            is_active = (sec_prog * 5.5) >= i
            gy = 330 + i * 95
            gbg = "#061f14" if is_active else "#08090e"
            goutline = "#10b981" if is_active else "#27272a"
            draw_card(draw, 120, gy, 1680, 80, fill=gbg, outline=goutline)

            draw.text((150, gy + 28), gnum, fill="#10b981" if is_active else "#71717a", font=FONTS["mono"])
            draw.text((270, gy + 28), gname, fill="#ffffff", font=FONTS["mono"])
            draw.text((680, gy + 28), glimit, fill="#a1a1aa", font=FONTS["mono"])
            draw.text((1200, gy + 28), gobs, fill="#6ee7b7" if is_active else "#71717a", font=FONTS["mono"])
            draw.text((1600, gy + 28), gstat if is_active else "[ PENDING ]", fill="#10b981" if is_active else "#52525b", font=FONTS["mono"])

        draw.text((120, 840), "CRYPTOGRAPHIC PROOF: SHA256_HASH = 0x7f29a01b44ec9... · HARDWARE INVARIANTS SATISFIED", fill="#60a5fa", font=FONTS["mono"])

    # ==============================================================
    # SECTOR 6: EXECUTION ALPHA & AUDITED TRAJECTORY
    # ==============================================================
    elif curr_sector["id"] == 6:
        draw_pill(draw, WIDTH // 2, 190, "ORDER FILLED: 3,500 USDT rNVDA @ $128.52 · SLIPPAGE 0.048%", "#10b981", "#063d27", "#a7f3d0", FONTS["mono"], "#10b981")

        draw.text((WIDTH // 2 - 380, 240), "60-Day Audited Equity Trajectory", fill="#ffffff", font=FONTS["huge"])
        draw.text((WIDTH // 2 - 420, 320), "Strict In-Sample (30d) vs Out-of-Sample (30d) Verification Without Overfit Decay", fill="#a1a1aa", font=FONTS["sub"])

        pstats = [
            ("TOTAL 60D RETURN", "+19.64%", "#34d399"),
            ("SHARPE RATIO", "2.34", "#60a5fa"),
            ("MAX DRAWDOWN", "-7.2%", "#f59e0b"),
            ("ALPHA OVER SPY", "+15.52%", "#a78bfa")
        ]
        for i, (plbl, pval, pcol) in enumerate(pstats):
            px = 120 + i * 425
            py = 380
            draw_card(draw, px, py, 395, 200, fill="#08090e", outline=pcol)
            draw.text((px + 30, py + 35), plbl, fill="#71717a", font=FONTS["mono_sm"])
            draw.text((px + 30, py + 95), pval, fill=pcol, font=FONTS["huge"])

        draw_card(draw, 120, 610, 1680, 280, fill="#040508", outline="#1e3a8a")
        draw.text((150, 635), "EQUITY CURVE: Initial $100,000 USDT -> Final $119,640 USDT (Solid: Aegis24 / Dashed: SPY Benchmark)", fill="#93c5fd", font=FONTS["mono_sm"])
        
        curve_pts = []
        spy_pts = []
        chart_w = 1600
        chart_h = 170
        base_y = 850
        num_pts = int(min(60, 20 + sec_prog * 42))
        for pt in range(num_pts):
            progress = pt / 60.0
            cx = 160 + int(progress * chart_w)
            cy = base_y - int((progress * 0.1964 + math.sin(progress * 8) * 0.015) * chart_h * 5)
            curve_pts.append((cx, cy))

            spy_y = base_y - int((progress * 0.0412) * chart_h * 5)
            spy_pts.append((cx, spy_y))

        if len(curve_pts) > 1:
            for s in range(len(curve_pts) - 1):
                draw.line([curve_pts[s], curve_pts[s + 1]], fill="#00e5ff", width=3)
            # Glowing tip
            last_pt = curve_pts[-1]
            draw.ellipse([last_pt[0] - 6, last_pt[1] - 6, last_pt[0] + 6, last_pt[1] + 6], fill="#ffffff", outline="#00e5ff", width=2)
        if len(spy_pts) > 1:
            for s in range(len(spy_pts) - 1):
                draw.line([spy_pts[s], spy_pts[s + 1]], fill="#52525b", width=2)

        draw.text((WIDTH // 2 - 380, 930), "Bitget AI & Crypto Hackathon S2 · Track 2: Agentic Trading · BuilderOS", fill="#71717a", font=FONTS["mono"])

    return img

def render_worker(args):
    idx, t = args
    img = render_frame(t, idx)
    return img.tobytes()

def main():
    total_frames = int(TOTAL_DURATION * FPS)
    print(f"Total duration: {TOTAL_DURATION:.2f}s ({total_frames} frames @ {FPS} fps)")
    print(f"Launching FFmpeg pipe to render {OUTPUT_VIDEO}...")

    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", AUDIO_FILE,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-tune", "animation",
        "-threads", "12",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        OUTPUT_VIDEO
    ]

    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    batch_size = 60
    t0 = time.time()
    
    with ProcessPoolExecutor(max_workers=8) as pool:
        for batch_start in range(0, total_frames, batch_size):
            batch_end = min(batch_start + batch_size, total_frames)
            tasks = [(i, i / float(FPS)) for i in range(batch_start, batch_end)]
            results = pool.map(render_worker, tasks)
            for raw_bytes in results:
                proc.stdin.write(raw_bytes)
            
            elapsed = time.time() - t0
            pct = (batch_end / total_frames) * 100
            fps_speed = batch_end / elapsed if elapsed > 0 else 0
            eta = (total_frames - batch_end) / fps_speed if fps_speed > 0 else 0
            print(f"Rendered {batch_end}/{total_frames} ({pct:.1f}%) | {fps_speed:.1f} fps | ETA: {eta:.0f}s")

    proc.stdin.close()
    proc.wait()
    print("Render complete!")
    print(f"Video saved to: {os.path.abspath(OUTPUT_VIDEO)}")

    public_dir = "frontend/public/video"
    os.makedirs(public_dir, exist_ok=True)
    import shutil
    shutil.copyfile(OUTPUT_VIDEO, os.path.join(public_dir, OUTPUT_VIDEO))
    print(f"Copied to public web folder: {os.path.abspath(os.path.join(public_dir, OUTPUT_VIDEO))}")

if __name__ == "__main__":
    main()
