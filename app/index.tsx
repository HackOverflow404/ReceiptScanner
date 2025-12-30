import Auth from '@/components/Auth'
import ThemedView from '@/components/ThemedView'
import { useTheme } from '@/contexts/ThemeProvider'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, Text } from 'react-native'
import 'react-native-url-polyfill/auto'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const theme = useTheme()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      // console.log('Auth state changed:', _event, session);
      setSession(session);
    });
  }, [supabase])

  useEffect(() => {
    // console.log('Session changed:', session);
    if (session) {
      router.replace('/(tabs)')
    }
  }, [session])

  return (
    <ThemedView>
      <Text
        style={[
          styles.title,
          { color: theme.TextColor, marginBottom: theme.PagePadding },
        ]}
      >
        Sign in
      </Text>
      { !session
          ? <Auth />
          : null
      }
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
});