/**
 * Aegis24 Institutional Design Tokens
 * Reusable palette, chart colors, font scales, and spacing across all components and visualizations.
 */

export const tokens = {
  colors: {
    bg: {
      darkest: '#08090b',
      card: '#0e1116',
      cardHover: '#131720',
      border: '#1e232d',
      borderFocus: '#2e3747',
      surface: '#0d1017',
    },
    brand: {
      cyan: '#00E5FF',
      cyanHover: '#33ebff',
      cyanMuted: 'rgba(0, 229, 255, 0.12)',
      teal: '#03AAC7',
      tealMuted: 'rgba(3, 170, 199, 0.15)',
      green: '#26c99b',
      greenMuted: 'rgba(38, 201, 155, 0.12)',
      red: '#f7647e',
      redMuted: 'rgba(247, 100, 126, 0.12)',
      amber: '#ffa963',
      amberMuted: 'rgba(255, 169, 99, 0.12)',
      purple: '#a855f7',
      purpleMuted: 'rgba(168, 85, 247, 0.12)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      muted: '#64748b',
      accent: '#00E5FF',
    },
    chart: {
      primary: '#00E5FF',
      secondary: '#03AAC7',
      inSample: '#3b82f6',
      outOfSample: '#00E5FF',
      benchmark: '#64748b',
      success: '#26c99b',
      danger: '#f7647e',
      warning: '#ffa963',
      grid: '#1e232d',
      tooltipBg: '#0e1116',
    },
    corridors: {
      safe: 'rgba(38, 201, 155, 0.15)',
      monitor: 'rgba(255, 169, 99, 0.15)',
      veto: 'rgba(247, 100, 126, 0.15)',
    }
  },
  thresholds: {
    maxSpreadPct: 0.35,
    maxNavDeviationPct: 2.50,
    maxPositionSizeUsdt: 5000.0,
    maxDailyDrawdownPct: 2.0,
    minConviction: 0.65,
  }
} as const;

export type ThemeTokens = typeof tokens;
