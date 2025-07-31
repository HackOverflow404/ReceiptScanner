import { ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';
import { useTheme } from '../contexts/ThemeProvider';

export function ThemedView({ style, ...otherProps }: ScrollViewProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    ScreenStyle: {
      flex: 1,
      backgroundColor: theme.PageColor,
      paddingTop: theme.TopPadding,
      padding: theme.PagePadding,
    }
  });

  return <ScrollView style={[styles.ScreenStyle, style]} {...otherProps} />;
}