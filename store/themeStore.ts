import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useEffect } from 'react';

type Theme = 'light' | 'dark';

export const lightColors = {
  primary: '#06B6D4',
  secondary: '#14B8A6',
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadow: '#00000015',
};

export const darkColors = {
  primary: '#06B6D4',
  secondary: '#14B8A6',
  background: '#0F172A',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  shadow: '#00000040',
};

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: typeof lightColors;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ 
          theme: newTheme,
          colors: newTheme === 'light' ? lightColors : darkColors
        });
      },
      setTheme: (theme: Theme) => {
        set({ 
          theme,
          colors: theme === 'light' ? lightColors : darkColors
        });
      },
      colors: lightColors,
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hook to initialize theme based on system preference
export function useInitializeTheme() {
  const systemScheme = useRNColorScheme();
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    // Only set the theme if it hasn't been explicitly set by the user
    // We can determine this by checking if the theme is still the default value
    if (theme === 'light' && systemScheme === 'dark') {
      setTheme('dark');
    }
  }, [systemScheme]);
}