import { useEffect, useRef } from 'react';
import { useScriptStore } from '../store/useScriptStore';
import { StorageService } from '../services/storageService';

export function useAutoSave(interval: number = 30000) {
  const { currentScript } = useScriptStore();
  const previousScriptRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!currentScript) return;

    const currentScriptString = JSON.stringify(currentScript);

    // Only save if script has changed
    if (previousScriptRef.current !== currentScriptString) {
      const timer = setTimeout(() => {
        StorageService.saveCurrentScript(currentScript);
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      }, interval);

      previousScriptRef.current = currentScriptString;

      return () => clearTimeout(timer);
    }
  }, [currentScript, interval]);
}
