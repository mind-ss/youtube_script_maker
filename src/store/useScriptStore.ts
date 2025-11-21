import { create } from 'zustand';
import type { Script, ScriptSection, TeleprompterState } from '../types/script.types';
import { StorageService } from '../services/storageService';
import { recalculateTimestamps } from '../utils/textAnalyzer';

interface ScriptStore {
  // Current script state
  currentScript: Script | null;
  isGenerating: boolean;
  error: string | null;

  // Teleprompter state
  teleprompter: TeleprompterState;

  // Actions
  setCurrentScript: (script: Script) => void;
  updateScript: (updates: Partial<Script>) => void;
  updateSection: (sectionId: string, updates: Partial<ScriptSection>) => void;
  deleteSection: (sectionId: string) => void;
  addSection: (section: Omit<ScriptSection, 'id'>) => void;
  reorderSections: (sections: ScriptSection[]) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  clearScript: () => void;
  saveScript: () => void;
  loadScript: (scriptId: string) => void;

  // Teleprompter actions
  startTeleprompter: () => void;
  stopTeleprompter: () => void;
  updateTeleprompterSettings: (settings: Partial<TeleprompterState>) => void;
}

export const useScriptStore = create<ScriptStore>((set, get) => ({
  // Initial state
  currentScript: StorageService.getCurrentScript(),
  isGenerating: false,
  error: null,
  teleprompter: {
    isActive: false,
    scrollSpeed: 50,
    fontSize: 24,
    currentSectionIndex: 0,
  },

  // Actions
  setCurrentScript: (script) => {
    set({ currentScript: script, error: null });
    StorageService.saveCurrentScript(script);
  },

  updateScript: (updates) => {
    const current = get().currentScript;
    if (!current) return;

    const updated: Script = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    set({ currentScript: updated });
    StorageService.saveCurrentScript(updated);
  },

  updateSection: (sectionId, updates) => {
    const current = get().currentScript;
    if (!current) return;

    const sections = current.sections.map(section =>
      section.id === sectionId
        ? { ...section, ...updates }
        : section
    );

    // Recalculate timestamps if content changed
    const updatedSections = updates.content
      ? recalculateTimestamps(sections)
      : sections;

    const totalDuration = updatedSections.reduce(
      (sum, s) => sum + s.estimatedDuration,
      0
    );

    const updated: Script = {
      ...current,
      sections: updatedSections,
      estimatedDuration: totalDuration,
      updatedAt: new Date().toISOString(),
    };

    set({ currentScript: updated });
    StorageService.saveCurrentScript(updated);
  },

  deleteSection: (sectionId) => {
    const current = get().currentScript;
    if (!current) return;

    const sections = current.sections.filter(s => s.id !== sectionId);
    const updatedSections = recalculateTimestamps(sections);

    const totalDuration = updatedSections.reduce(
      (sum, s) => sum + s.estimatedDuration,
      0
    );

    const updated: Script = {
      ...current,
      sections: updatedSections,
      estimatedDuration: totalDuration,
      updatedAt: new Date().toISOString(),
    };

    set({ currentScript: updated });
    StorageService.saveCurrentScript(updated);
  },

  addSection: (section) => {
    const current = get().currentScript;
    if (!current) return;

    const newSection: ScriptSection = {
      ...section,
      id: `section-${Date.now()}`,
      estimatedDuration: 0,
      timestamp: '00:00',
    };

    const sections = [...current.sections, newSection];
    const updatedSections = recalculateTimestamps(sections);

    const totalDuration = updatedSections.reduce(
      (sum, s) => sum + s.estimatedDuration,
      0
    );

    const updated: Script = {
      ...current,
      sections: updatedSections,
      estimatedDuration: totalDuration,
      updatedAt: new Date().toISOString(),
    };

    set({ currentScript: updated });
    StorageService.saveCurrentScript(updated);
  },

  reorderSections: (sections) => {
    const current = get().currentScript;
    if (!current) return;

    const updatedSections = recalculateTimestamps(sections);

    const updated: Script = {
      ...current,
      sections: updatedSections,
      updatedAt: new Date().toISOString(),
    };

    set({ currentScript: updated });
    StorageService.saveCurrentScript(updated);
  },

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  clearScript: () => {
    set({ currentScript: null, error: null });
    StorageService.clearCurrentScript();
  },

  saveScript: () => {
    const current = get().currentScript;
    if (current) {
      StorageService.saveScript(current);
    }
  },

  loadScript: (scriptId) => {
    const scripts = StorageService.getSavedScripts();
    const script = scripts.find(s => s.id === scriptId);
    if (script) {
      set({ currentScript: script });
      StorageService.saveCurrentScript(script);
    }
  },

  // Teleprompter actions
  startTeleprompter: () => {
    set(state => ({
      teleprompter: { ...state.teleprompter, isActive: true, currentSectionIndex: 0 },
    }));
  },

  stopTeleprompter: () => {
    set(state => ({
      teleprompter: { ...state.teleprompter, isActive: false },
    }));
  },

  updateTeleprompterSettings: (settings) => {
    set(state => ({
      teleprompter: { ...state.teleprompter, ...settings },
    }));
  },
}));
