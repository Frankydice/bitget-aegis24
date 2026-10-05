import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  ShieldCheck,
  Zap,
  TrendingUp,
  Activity,
  CheckCircle2,
  Cpu,
  BarChart3,
  Award,
  Lock,
  ArrowRight,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface MotionShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Scene {
  id: number;
  title: string;
  subtitle: string;
  startTime: number;
  endTime: number;
}

const SCENES: Scene[] = [
  { id: 1, title: 'The 65-Hour Market Darkness', subtitle: 'Continuous Off-Hours Volatility Without Discretion', startTime: 0, endTime: 7.5 },
  { id: 2, title: '24/7 rToken Orderbook Discovery', subtitle: 'Synthetic US Equities on Bitget MCP', startTime: 7.5, endTime: 15.5 },
  { id: 3, title: 'Weekend Shockwave Injection', subtitle: 'Autonomous Perception of Breaking Catalysts', startTime: 15.5, endTime: 23.5 },
  { id: 4, title: 'Cognitive Swarm Deliberation', subtitle: 'Multi-Agent Consensus & Conviction Sizing', startTime: 23.5, endTime: 31.5 },
  { id: 5, title: '5 Deterministic Safety Gates', subtitle: 'Zero-Discretion Hardware Seatbelt', startTime: 31.5, endTime: 39.5 },
  { id: 6, title: 'Execution & Out-of-Sample Alpha', subtitle: '+19.64% Audited 60-Day Equity Trajectory', startTime: 39.5, endTime: 48.0 }
];

const TOTAL_DURATION = 48.0;

export const MotionShowcase: React.FC<MotionShowcaseProps> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Sound synthesis helpers using standard Web Audio API
  const playSound = useCallback((type: 'bass' | 'shock' | 'gate' | 'success') => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      if (type === 'bass') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(38, now + 0.6);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'shock') {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'gate') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'success') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const chordGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          chordGain.gain.setValueAtTime(0.12, now + i * 0.05);
          chordGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          osc.connect(chordGain);
          chordGain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + 0.8);
        });
      }
    } catch {
      // Audio fallback silent
    }
  }, [isMuted]);

  // Track scene changes to trigger sound design
  const currentSceneIndex = SCENES.findIndex(s => currentTime >= s.startTime && currentTime < s.endTime);
  const activeScene = SCENES[currentSceneIndex >= 0 ? currentSceneIndex : 0];
  const prevSceneIdRef = useRef<number>(1);

  useEffect(() => {
    if (activeScene.id !== prevSceneIdRef.current) {
      if (activeScene.id === 3) playSound('shock');
      else if (activeScene.id === 5) playSound('gate');
      else if (activeScene.id === 6) playSound('success');
      else playSound('bass');
      prevSceneIdRef.current = activeScene.id;
    }
  }, [activeScene.id, playSound]);

  // Main playback tick loop
  useEffect(() => {
    if (!isOpen) return;

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackSpeed;
          if (next >= TOTAL_DURATION) {
            if (isRecording) {
              stopRecording();
            }
            return 0; // Loop or restart
          }
          if (isRecording) {
            setRecordProgress(Math.round((next / TOTAL_DURATION) * 100));
          }
          return next;
        });
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = null;
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, playbackSpeed, isRecording]);

  // Handle Video Recording
  const startRecording = () => {
    if (!canvasRef.current) return;
    try {
      setCurrentTime(0);
      setIsPlaying(true);
      setIsRecording(true);
      setRecordProgress(0);
      recordedChunksRef.current = [];

      const stream = canvasRef.current.captureStream(60);
      const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000 });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aegis24_motion_showcase_60fps.webm';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setIsRecording(false);
      };

      recorder.start(100);
    } catch (e) {
      console.error('Recording initialization error:', e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Render high-framerate motion graphics onto the HD canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 1920;
    const h = 1080;
    canvas.width = w;
    canvas.height = h;

    const t = currentTime;

    // Background Gradient with ambient motion
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 80, w / 2, h / 2, w * 0.7);
    bgGrad.addColorStop(0, '#0a0d18');
    bgGrad.addColorStop(0.6, '#030407');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 80;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Animated Electric Starlight Lightning Arc (Sweeps across the backdrop)
    const arcOffset = (t * 120) % (w * 1.5);
    ctx.save();
    ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
    ctx.shadowBlur = 30;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.35 + Math.sin(t * 1.2) * 40);
    ctx.bezierCurveTo(
      w * 0.35, h * 0.65 + Math.cos(t * 1.5) * 50,
      w * 0.65, h * 0.15 + Math.sin(t * 1.8) * 40,
      w, h * 0.45 + Math.cos(t * 1.2) * 50
    );
    ctx.stroke();

    // Electric cyan secondary filament
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.38 + Math.cos(t * 1.6) * 30);
    ctx.bezierCurveTo(
      w * 0.4, h * 0.58 + Math.sin(t * 1.3) * 35,
      w * 0.6, h * 0.22 + Math.cos(t * 1.7) * 45,
      w, h * 0.4 + Math.sin(t * 1.1) * 30
    );
    ctx.stroke();
    ctx.restore();

    // Floating Starlight Particles
    for (let i = 0; i < 40; i++) {
      const px = ((i * 137.5 + t * 35) % w);
      const py = ((i * 89.3 + Math.sin(t + i) * 60) % (h * 0.8)) + h * 0.1;
      const size = (Math.sin(t * 3 + i) * 0.5 + 0.5) * 2.5 + 1;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(96, 165, 250, 0.9)';
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Top Brand Telemetry Badge
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('AEGIS24', 90, 85);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '400 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('· 24/7 Autonomous rToken Agent Desk · Bitget S2', 200, 85);

    // Live Act Indicator Pill
    ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(w - 380, 55, 290, 42, 21);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(w - 355, 76, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#93c5fd';
    ctx.font = '600 13px "JetBrains Mono", monospace';
    ctx.fillText(`ACT 0${activeScene.id} / 06 · ${activeScene.title.slice(0, 18).toUpperCase()}`, w - 340, 81);

    // ==========================================
    // SCENE 1: THE THESIS & 65-HOUR DARKNESS
    // ==========================================
    if (t < 7.5) {
      const p = t / 7.5;
      const fadeIn = Math.min(1, t * 1.5);
      ctx.save();
      ctx.globalAlpha = fadeIn;

      // Illuminated Pill Tag
      ctx.fillStyle = 'rgba(10, 22, 40, 0.8)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 240, 320, 480, 44, 22);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#3b82f6';
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('• 24/7 AUTONOMOUS RTOKEN AGENT DESK', w / 2, 347);

      // Main Dual-Tone Headline (Identical to Screenshot)
      ctx.fillStyle = '#ffffff';
      ctx.font = '500 76px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('When US equities trade 24/7.', w / 2, 450);

      ctx.fillStyle = '#a3a3a3';
      ctx.font = '400 76px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText("Humans sleep, agents don't.", w / 2, 545);

      // Subtitle
      ctx.fillStyle = '#d4d4d8';
      ctx.font = '300 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText(
        'Aegis24 turns continuous tokenized US equity orderbooks into a coordinated strategy,',
        w / 2,
        640
      );
      ctx.fillText('with a deterministic hardware seatbelt when real life gets in the way.', w / 2, 678);

      // Center High-Contrast White Pill CTA
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 140, 740, 280, 60, 30);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = '600 19px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('Try the live desk →', w / 2, 777);

      ctx.restore();
    }

    // ==========================================
    // SCENE 2: 24/7 rTOKEN ORDERBOOK DISCOVERY
    // ==========================================
    else if (t < 15.5) {
      const p = (t - 7.5) / 8.0;
      ctx.save();
      ctx.textAlign = 'left';

      // Section Title Banner
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Continuous Off-Hours Orderbooks', 180, 260);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 22px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Real-time synthetic pricing, micro-spreads, and synthetic NAV parity', 180, 305);

      // 3 Holographic Cards: NVDA, TSLA, AAPL
      const cards = [
        { sym: 'rNVDA', price: 128.45 + Math.sin(t * 3) * 0.15, change: '+3.42%', spread: '0.11%', passed: true },
        { sym: 'rTSLA', price: 242.10 + Math.cos(t * 2.5) * 0.25, change: '+5.18%', spread: '0.14%', passed: true },
        { sym: 'rMSTR', price: 345.80 + Math.sin(t * 2) * 0.6, change: '+8.92%', spread: '0.58%', passed: false }
      ];

      cards.forEach((card, idx) => {
        const cx = 180 + idx * 530;
        const cy = 370;

        ctx.fillStyle = 'rgba(12, 12, 14, 0.92)';
        ctx.strokeStyle = card.passed ? 'rgba(59, 130, 246, 0.3)' : 'rgba(244, 63, 94, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx, cy, 480, 420, 28);
        ctx.fill();
        ctx.stroke();

        // Card Header
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 32px "JetBrains Mono", monospace';
        ctx.fillText(card.sym, cx + 36, cy + 65);

        ctx.fillStyle = card.passed ? '#34d399' : '#fb7185';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.fillText(card.change, cx + 340, cy + 65);

        // Price
        ctx.fillStyle = '#ffffff';
        ctx.font = '700 52px "JetBrains Mono", monospace';
        ctx.fillText(`$${card.price.toFixed(2)}`, cx + 36, cy + 155);

        ctx.fillStyle = '#71717a';
        ctx.font = '400 16px "JetBrains Mono", monospace';
        ctx.fillText('SYNTHETIC FAIR VALUE: 99.96% PARITY', cx + 36, cy + 195);

        // Orderbook depth mini simulation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(cx + 36, cy + 230, 408, 100);

        // Green bid bar
        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.fillRect(cx + 40, cy + 240, 280 + Math.sin(t * 4 + idx) * 30, 32);
        // Red ask bar
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.fillRect(cx + 40, cy + 285, 240 + Math.cos(t * 4 + idx) * 25, 32);

        // Status Badge
        ctx.fillStyle = card.passed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.strokeStyle = card.passed ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.roundRect(cx + 36, cy + 355, 408, 42, 12);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = card.passed ? '#6ee7b7' : '#fca5a5';
        ctx.font = '600 15px "JetBrains Mono", monospace';
        ctx.fillText(
          card.passed ? `SPREAD: ${card.spread} (SAFE LIQUIDITY PASS)` : `SPREAD: ${card.spread} (SEATBELT VETO TRIGGERED)`,
          cx + 56,
          cy + 382
        );
      });

      ctx.restore();
    }

    // ==========================================
    // SCENE 3: WEEKEND SHOCKWAVE INJECTION
    // ==========================================
    else if (t < 23.5) {
      const p = (t - 15.5) / 8.0;
      ctx.save();
      ctx.textAlign = 'center';

      // Shock Wave Concentric Rings
      const ringRadius = (p * 800) % 600;
      ctx.strokeStyle = `rgba(0, 229, 255, ${Math.max(0, 0.6 - ringRadius / 600)})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(w / 2, 540, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Emergency Alert Pill
      ctx.fillStyle = 'rgba(244, 63, 94, 0.15)';
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 250, 220, 500, 48, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f43f5e';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText('⚡ CATALYST SHOCK INJECTED · SUNDAY 03:14 UTC', w / 2, 251);

      // Central Headline Card
      ctx.fillStyle = 'rgba(10, 10, 12, 0.95)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 580, 310, 1160, 460, 32);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('TSMC Weekend Wafer Yield Breakthrough', w / 2, 410);

      ctx.fillStyle = '#93c5fd';
      ctx.font = '600 24px "JetBrains Mono", monospace';
      ctx.fillText('+18% Yield Disclosed on Blackwell 3nm Nodes · Taipei Press Briefing', w / 2, 475);

      // Target Volatility & Sizing Metrics
      const metrics = [
        { label: 'TARGET ASSET', val: 'NVDAUSDT' },
        { label: 'DIRECTIONAL BIAS', val: 'STRONG BULLISH' },
        { label: 'EXPECTED SHOCK MOVE', val: '+4.20%' },
        { label: 'ORDERBOOK DEPTH', val: '$65,000 USDT' }
      ];

      metrics.forEach((m, i) => {
        const mx = w / 2 - 450 + i * 230;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(mx, 540, 210, 110, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#71717a';
        ctx.font = '600 12px "JetBrains Mono", monospace';
        ctx.fillText(m.label, mx + 105, 575);

        ctx.fillStyle = '#ffffff';
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(m.val, mx + 105, 615);
      });

      // Pulse bar at bottom
      ctx.fillStyle = '#3b82f6';
      ctx.font = '500 18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Routing directly to Qwen Multi-Agent Deliberation Swarm...', w / 2, 720);

      ctx.restore();
    }

    // ==========================================
    // SCENE 4: COGNITIVE SWARM DELIBERATION
    // ==========================================
    else if (t < 31.5) {
      const p = (t - 23.5) / 8.0;
      ctx.save();
      ctx.textAlign = 'left';

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Qwen Cognitive Swarm Deliberation', 180, 240);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 22px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Cross-domain consensus debate converging toward high-conviction allocation', 180, 285);

      // Swarm Nodes Array
      const agents = [
        { name: 'Macro Analyst', role: 'Dovish 50bps cut cycle confirms liquidity expansion', conf: 89, color: '#38bdf8' },
        { name: 'Earnings Analyst', role: 'Blackwell GPU supply unlock drives DC revenue expansion', conf: 96, color: '#4ade80' },
        { name: 'Microstructure Guard', role: 'Orderbook spread at 0.11%, low slippage absorption capacity', conf: 92, color: '#facc15' },
        { name: 'Valuation Auditor', role: 'Current price trades inside 0.05% fair value NAV corridor', conf: 94, color: '#c084fc' }
      ];

      agents.forEach((ag, i) => {
        const ay = 340 + i * 115;
        ctx.fillStyle = 'rgba(12, 12, 14, 0.9)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(180, ay, 960, 95, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = ag.color;
        ctx.font = '700 20px "JetBrains Mono", monospace';
        ctx.fillText(ag.name, 215, ay + 42);

        ctx.fillStyle = '#d4d4d8';
        ctx.font = '400 16px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillText(ag.role, 215, ay + 72);

        // Confidence gauge
        ctx.fillStyle = ag.color;
        ctx.font = '700 24px "JetBrains Mono", monospace';
        ctx.fillText(`${ag.conf}%`, 1040, ay + 55);
      });

      // Swarm Consensus Gauge on Right
      const gaugeX = 1200;
      const gaugeY = 340;
      ctx.fillStyle = 'rgba(10, 16, 28, 0.95)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath();
      ctx.roundRect(gaugeX, gaugeY, 540, 440, 28);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#60a5fa';
      ctx.font = '600 16px "JetBrains Mono", monospace';
      ctx.fillText('SWARM CONSENSUS VERDICT', gaugeX + 50, gaugeY + 70);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 68px "JetBrains Mono", monospace';
      ctx.fillText('UNANIMOUS BUY', gaugeX + 50, gaugeY + 160);

      const fillPct = Math.min(0.94, p * 1.2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(gaugeX + 50, gaugeY + 220, 440, 28);

      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(gaugeX + 50, gaugeY + 220, 440 * fillPct, 28);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 36px "JetBrains Mono", monospace';
      ctx.fillText('94% Conviction', gaugeX + 50, gaugeY + 310);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 18px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Suggested Size: $3,500 USDT (3.5% AUM)', gaugeX + 50, gaugeY + 360);
      ctx.fillText('Target Price: $134.20 (+4.47%)', gaugeX + 50, gaugeY + 395);

      ctx.restore();
    }

    // ==========================================
    // SCENE 5: THE 5 DETERMINISTIC SAFETY GATES
    // ==========================================
    else if (t < 39.5) {
      const p = (t - 31.5) / 8.0;
      ctx.save();
      ctx.textAlign = 'left';

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 48px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Deterministic Safety Harness', 180, 230);

      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 22px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Zero-discretion code enforcing mathematical risk invariants before order routing', 180, 275);

      const gates = [
        { num: 'GATE 01', name: 'CircuitBreakerCheck', limit: 'Daily Drawdown < 2.0%', obs: 'Drawdown = 0.12%', passed: true },
        { num: 'GATE 02', name: 'LiquiditySpreadCheck', limit: 'Orderbook Spread <= 0.35%', obs: 'Spread = 0.11%', passed: true },
        { num: 'GATE 03', name: 'FairValueDeviationCheck', limit: 'Synthetic NAV Diff <= 2.50%', obs: 'Deviation = 0.04%', passed: true },
        { num: 'GATE 04', name: 'PositionSizingCheck', limit: 'Max Size <= $5,000 USDT', obs: 'Size = $3,500 USDT', passed: true },
        { num: 'GATE 05', name: 'MarketOpenDeRiskCheck', limit: 'Outside NYSE 9:30 AM Bell', obs: 'Safe Weekend Window', passed: true }
      ];

      gates.forEach((gate, idx) => {
        const isRevealed = p * 5.5 >= idx;
        const gy = 330 + idx * 88;

        ctx.fillStyle = isRevealed ? 'rgba(10, 24, 18, 0.85)' : 'rgba(15, 15, 18, 0.4)';
        ctx.strokeStyle = isRevealed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(180, gy, 1560, 72, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isRevealed ? '#34d399' : '#71717a';
        ctx.font = '700 16px "JetBrains Mono", monospace';
        ctx.fillText(gate.num, 215, gy + 42);

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.fillText(gate.name, 350, gy + 42);

        ctx.fillStyle = '#9ca3af';
        ctx.font = '400 16px "JetBrains Mono", monospace';
        ctx.fillText(gate.limit, 750, gy + 42);

        ctx.fillStyle = '#6ee7b7';
        ctx.font = '600 16px "JetBrains Mono", monospace';
        ctx.fillText(gate.obs, 1200, gy + 42);

        ctx.fillStyle = isRevealed ? '#10b981' : '#52525b';
        ctx.font = '700 16px "JetBrains Mono", monospace';
        ctx.fillText(isRevealed ? '✔ PASSED' : 'PENDING', 1580, gy + 42);
      });

      // Cryptographic Audit Stamp
      ctx.fillStyle = '#60a5fa';
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.fillText('CRYPTOGRAPHIC HASH: risk_7f29a01b44ec9 · ZERO DISCRETION MATHEMATICAL GUARANTEE', 180, 810);

      ctx.restore();
    }

    // ==========================================
    // SCENE 6: EXECUTION & OUT-OF-SAMPLE ALPHA
    // ==========================================
    else {
      const p = (t - 39.5) / 8.5;
      ctx.save();
      ctx.textAlign = 'center';

      // Fill Confirmation Notification Card
      ctx.fillStyle = 'rgba(6, 22, 14, 0.95)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 450, 180, 900, 110, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = '700 24px "JetBrains Mono", monospace';
      ctx.fillText('⚡ ORDER FILLED: 3,500 USDT rNVDA @ $128.52', w / 2, 230);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '400 16px "JetBrains Mono", monospace';
      ctx.fillText('Subaccount: BG-SUB-94029-ISOLATED · Slippage: 0.048% · Execution: Instant', w / 2, 265);

      // Trajectory Alpha Metrics Box
      ctx.fillStyle = 'rgba(10, 10, 12, 0.95)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 750, 320, 1500, 480, 32);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 42px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('60-Day Audited Equity Trajectory', w / 2, 395);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '400 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Strict In-Sample (30d) vs Out-of-Sample (30d) Overfitting Defense', w / 2, 435);

      // 4 Metric Circles
      const stats = [
        { label: 'TOTAL 60D RETURN', val: '+19.64%', color: '#34d399' },
        { label: 'SHARPE RATIO', val: '2.34', color: '#60a5fa' },
        { label: 'MAX DRAWDOWN', val: '-7.2%', color: '#f59e0b' },
        { label: 'ALPHA OVER SPY', val: '+15.52%', color: '#a78bfa' }
      ];

      stats.forEach((st, idx) => {
        const sx = w / 2 - 540 + idx * 360;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(sx - 150, 480, 300, 160, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#a1a1aa';
        ctx.font = '600 14px "JetBrains Mono", monospace';
        ctx.fillText(st.label, sx, 530);

        ctx.fillStyle = st.color;
        ctx.font = '800 52px "JetBrains Mono", monospace';
        ctx.fillText(st.val, sx, 605);
      });

      // Outro Credentials
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 20px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('Bitget AI & Crypto Hackathon S2 · Track 2: Agentic Trading · BuilderOS Standard', w / 2, 735);

      ctx.restore();
    }
  }, [currentTime, isOpen, activeScene]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-2 sm:p-6 overflow-hidden select-none animate-fadeIn">
      {/* Container Frame */}
      <div className="relative w-full max-w-7xl h-full max-h-[92vh] flex flex-col rounded-3xl border border-white/10 bg-[#040404] shadow-2xl overflow-hidden">
        {/* Header Control Strip */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 via-cyan-400 to-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="h-4 w-4 text-black stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-white font-sans">
                Aegis24 <span className="text-cyan-400">Motion Reel</span>
              </span>
              <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-2.5 py-0.5 text-[10px] font-mono text-blue-300">
                1080p · 60fps Broadcast Experience
              </span>
            </div>
          </div>

          {/* Quick Actions: Recording, Audio & Close */}
          <div className="flex items-center gap-3">
            {/* Record / Export MP4/WebM Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
              title="Record and export 60fps video directly to downloads"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isRecording ? `Recording (${recordProgress}%)` : 'Export Video Reel'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 16:9 Broadcast Canvas Canvas */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain max-h-[75vh]"
          />
        </div>

        {/* Footer Scrubber & Scene Controls */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/80 space-y-3">
          {/* Progress Bar & Markers */}
          <div className="relative w-full">
            <input
              type="range"
              min={0}
              max={TOTAL_DURATION}
              step={0.1}
              value={currentTime}
              onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            {/* Scene Markers */}
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mt-1.5 px-0.5">
              {SCENES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentTime(s.startTime)}
                  className={`hover:text-white transition-colors cursor-pointer truncate ${
                    activeScene.id === s.id ? 'text-blue-400 font-bold' : ''
                  }`}
                >
                  Act {s.id}: {s.title.slice(0, 14)}
                </button>
              ))}
            </div>
          </div>

          {/* Player Playback Controls */}
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
              </button>

              <button
                onClick={() => setCurrentTime(0)}
                className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Restart Reel"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="text-neutral-400">
                <span className="text-white font-bold">{currentTime.toFixed(1)}s</span> / {TOTAL_DURATION}s
              </div>
            </div>

            {/* Current Scene Display */}
            <div className="hidden md:flex items-center gap-2 text-neutral-400">
              <span className="text-blue-400 font-semibold">{activeScene.title}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-500">{activeScene.subtitle}</span>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5">
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-blue-500 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
