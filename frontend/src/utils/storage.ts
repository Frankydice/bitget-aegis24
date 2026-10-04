/**
 * Aegis24 Local Storage Persistence Utilities
 * Ensures user input, shock simulations, and settings survive page refreshes.
 */

const STORAGE_KEYS = {
  ACTIVE_SYMBOL: 'aegis24_active_symbol',
  CUSTOM_SHOCK_DRAFT: 'aegis24_custom_shock_draft',
  SIMULATION_HISTORY: 'aegis24_simulation_history',
  WHAT_IF_DRAFT: 'aegis24_what_if_draft',
  RECOMMENDATIONS_DISMISSED: 'aegis24_dismissed_recommendations',
} as const;

export interface CustomShockDraft {
  symbol: string;
  title: string;
  content: string;
  bias: string;
  targetMove: number;
  customParameters: Array<{ key: string; value: string }>;
}

export interface WhatIfDraft {
  symbol: string;
  sizeUsdt: number;
  simulatedBid: number;
  simulatedAsk: number;
  syntheticNav: number;
}

export const storage = {
  getActiveSymbol: (fallback: string = 'NVDAUSDT'): string => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SYMBOL) || fallback;
    } catch {
      return fallback;
    }
  },

  setActiveSymbol: (symbol: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SYMBOL, symbol);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getCustomShockDraft: (defaults: CustomShockDraft): CustomShockDraft => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_SHOCK_DRAFT);
      return data ? JSON.parse(data) : defaults;
    } catch {
      return defaults;
    }
  },

  saveCustomShockDraft: (draft: CustomShockDraft): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_SHOCK_DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getWhatIfDraft: (defaults: WhatIfDraft): WhatIfDraft => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WHAT_IF_DRAFT);
      return data ? JSON.parse(data) : defaults;
    } catch {
      return defaults;
    }
  },

  saveWhatIfDraft: (draft: WhatIfDraft): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.WHAT_IF_DRAFT, JSON.stringify(draft));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getRecentSimulations: (): any[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIMULATION_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecentSimulation: (item: any): void => {
    try {
      const current = storage.getRecentSimulations();
      const updated = [item, ...current].slice(0, 15);
      localStorage.setItem(STORAGE_KEYS.SIMULATION_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }
};
