import { useEffect, useState } from 'react';
import { StorageService } from '../services/storageService';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const settings = StorageService.getSettings();
    return settings.darkMode;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    StorageService.saveSettings({ darkMode });
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
}
