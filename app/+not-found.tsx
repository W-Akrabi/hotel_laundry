import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeStore } from '@/store/themeStore';

export default function NotFoundScreen() {
  const colors = useThemeStore(state => state.colors);

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">Page not found</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          The link you opened does not match a screen in the app.
        </ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    marginTop: 8,
    paddingVertical: 10,
  },
});
