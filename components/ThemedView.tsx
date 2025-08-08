import { useTheme } from '@/contexts/ThemeProvider';
import { SafeAreaView, ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';

export default function ThemedView({ style, contentContainerStyle, ...otherProps }: ScrollViewProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.PageColor,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.PagePadding,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        {...otherProps}
      />
    </SafeAreaView>
  );
}