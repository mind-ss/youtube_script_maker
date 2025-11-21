import type { Script, ScriptVersion, StorageData, UserSettings } from '../types/script.types';

const STORAGE_KEYS = {
  CURRENT_SCRIPT: 'youtube-script-writer:current-script',
  SAVED_SCRIPTS: 'youtube-script-writer:saved-scripts',
  VERSIONS: 'youtube-script-writer:versions',
  LAST_SAVED: 'youtube-script-writer:last-saved',
  SETTINGS: 'youtube-script-writer:settings',
};

const DEFAULT_SETTINGS: UserSettings = {
  autoSaveInterval: 30000, // 30 seconds
  darkMode: false,
  defaultTone: 'friendly',
  defaultAudience: 'general',
  charactersPerMinute: 225,
  wordsPerMinute: 155,
};

export class StorageService {
  // Current Script
  static saveCurrentScript(script: Script): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_SCRIPT, JSON.stringify(script));
      localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save current script:', error);
    }
  }

  static getCurrentScript(): Script | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SCRIPT);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load current script:', error);
      return null;
    }
  }

  static clearCurrentScript(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SCRIPT);
  }

  // Saved Scripts
  static saveScript(script: Script): void {
    try {
      const scripts = this.getSavedScripts();
      const existingIndex = scripts.findIndex(s => s.id === script.id);

      if (existingIndex >= 0) {
        scripts[existingIndex] = script;
      } else {
        scripts.unshift(script);
      }

      // Keep only last 50 scripts
      const limited = scripts.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.SAVED_SCRIPTS, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save script:', error);
    }
  }

  static getSavedScripts(): Script[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_SCRIPTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load saved scripts:', error);
      return [];
    }
  }

  static deleteScript(scriptId: string): void {
    try {
      const scripts = this.getSavedScripts();
      const filtered = scripts.filter(s => s.id !== scriptId);
      localStorage.setItem(STORAGE_KEYS.SAVED_SCRIPTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete script:', error);
    }
  }

  // Version History
  static saveVersion(script: Script, versionName?: string): void {
    try {
      const versions = this.getVersions();
      const newVersion: ScriptVersion = {
        id: Date.now(),
        name: versionName || `버전 ${versions.length + 1}`,
        script,
        timestamp: new Date().toISOString(),
      };

      versions.unshift(newVersion);

      // Keep only last 10 versions
      const limited = versions.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save version:', error);
    }
  }

  static getVersions(): ScriptVersion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VERSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load versions:', error);
      return [];
    }
  }

  static deleteVersion(versionId: number): void {
    try {
      const versions = this.getVersions();
      const filtered = versions.filter(v => v.id !== versionId);
      localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete version:', error);
    }
  }

  static clearVersions(): void {
    localStorage.removeItem(STORAGE_KEYS.VERSIONS);
  }

  // Settings
  static saveSettings(settings: Partial<UserSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Failed to load settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  // Last Saved
  static getLastSaved(): string | null {
    return localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
  }

  // Export all data
  static exportAllData(): StorageData {
    return {
      currentScript: this.getCurrentScript(),
      savedScripts: this.getSavedScripts(),
      versions: this.getVersions(),
      lastSaved: this.getLastSaved(),
      settings: this.getSettings(),
    };
  }

  // Import all data
  static importAllData(data: StorageData): void {
    try {
      if (data.currentScript) {
        this.saveCurrentScript(data.currentScript);
      }
      if (data.savedScripts) {
        localStorage.setItem(STORAGE_KEYS.SAVED_SCRIPTS, JSON.stringify(data.savedScripts));
      }
      if (data.versions) {
        localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(data.versions));
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  }

  // Clear all data
  static clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
