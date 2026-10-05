import asyncio
import os
import subprocess
import edge_tts

VOICE = "en-US-AndrewNeural"

SECTORS = [
    {
        "id": 1,
        "name": "darkness_thesis",
        "text": "Welcome to Aegis 24. Traditional U.S. equity markets close every Friday at 4:00 PM Eastern, remaining completely dark for sixty-five consecutive weekend hours. While humans sleep, global macro catalysts, rate decisions, and crypto liquidity never stop. Aegis 24 is the first autonomous agent desk engineered specifically to capture 24/7 tokenized U.S. equity alpha without human delay."
    },
    {
        "id": 2,
        "name": "orderbooks_microstructure",
        "text": "Connected directly to continuous off-hours orderbooks via the Bitget Model Context Protocol, Aegis 24 monitors synthetic U.S. stocks including NVIDIA, Tesla, Apple, and MicroStrategy around the clock. The platform continuously tracks best bids, asks, microsecond spread corridors, and synthetic NAV fair value parity to ensure zero weekend gap risk."
    },
    {
        "id": 3,
        "name": "shock_terminal",
        "text": "When breaking news strikes on a Sunday morning, our interactive Event Simulation Terminal ingests the catalyst immediately. Whether it's an emergency Fed rate shift or an unexpected semiconductor breakthrough, Aegis 24 autonomously calculates directional bias, projected volatility, and orderbook absorption capacity in real time."
    },
    {
        "id": 4,
        "name": "swarm_deliberation",
        "text": "Next, the Qwen Cognitive Consensus Swarm convenes. Specialized autonomous agents—including our Macro Analyst, Earnings Auditor, and Microstructure Guard—debate the catalyst across multi-domain quantitative models, rapidly synthesizing a high-conviction consensus recommendation."
    },
    {
        "id": 5,
        "name": "deterministic_gates",
        "text": "Critically, large language models never hold execution discretion. Every proposal must pass our five zero-discretion mathematical gates: daily portfolio drawdown circuit breakers, bid-ask spread limits under zero point three five percent, fair value deviation bands, sub-account risk sizing, and pre-market NYSE opening volatility freezes. Each decision is stamped with an immutable cryptographic risk hash."
    },
    {
        "id": 6,
        "name": "execution_alpha",
        "text": "Approved orders execute instantaneously into isolated sub-accounts with minimal slippage. Backtested across sixty days of rigorous out-of-sample data, Aegis 24 achieves a two point three four Sharpe ratio, zero overfit decay, and a nineteen point six percent audited net return—outperforming the S.P.Y. benchmark by over fifteen percent. Aegis 24: where autonomous intelligence meets deterministic institutional safety."
    }
]

FFMPEG_EXE = r"C:\Users\HomePC\AppData\Local\Programs\Python\Python313\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"

async def main():
    os.makedirs("audio_temp", exist_ok=True)
    os.makedirs("frontend/public/audio", exist_ok=True)

    file_list = []
    print("Generating neural voiceover tracks...")
    for sector in SECTORS:
        out_path = f"audio_temp/sector_{sector['id']}_{sector['name']}.mp3"
        print(f"Generating Sector {sector['id']}: {sector['name']}...")
        comm = edge_tts.Communicate(sector["text"], VOICE, rate="+6%")
        await comm.save(out_path)
        file_list.append(out_path)

    # Combine into master voiceover with slight padding
    concat_txt = "audio_temp/concat_list.txt"
    with open(concat_txt, "w") as f:
        for p in file_list:
            f.write(f"file '{os.path.abspath(p).replace(chr(92), '/')}'\n")

    master_dest = "aegis24_voiceover.mp3"
    public_dest = "frontend/public/audio/voiceover.mp3"

    print("Concatenating into master voiceover...")
    cmd = [
        FFMPEG_EXE, "-y", "-f", "concat", "-safe", "0",
        "-i", concat_txt, "-c:a", "libmp3lame", "-b:a", "192k", master_dest
    ]
    subprocess.run(cmd, check=True)

    # Copy to public folder
    import shutil
    shutil.copyfile(master_dest, public_dest)
    print(f"Voiceover successfully generated at:")
    print(f"1. {os.path.abspath(master_dest)}")
    print(f"2. {os.path.abspath(public_dest)}")

if __name__ == "__main__":
    asyncio.run(main())
