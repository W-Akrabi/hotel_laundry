import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useThemeStore, useInitializeTheme } from '../store/themeStore';
import { useServicesStore } from '../store/servicesStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Initialize theme based on system preference
  useInitializeTheme();

  // Pre-fetch services when app loads
  const fetchServices = useServicesStore(state => state.fetchServices);

  // Fetch services on app load
  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return <RootLayoutContent />;
}

function RootLayoutContent() {
  const theme = useThemeStore(state => state.theme);

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}
