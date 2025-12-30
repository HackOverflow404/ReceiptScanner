import { useTheme } from "@/contexts/ThemeProvider";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EmailForm() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox to verify your email.");
    setLoading(false);
  }

  return (
    <View style={[styles.container, { marginBottom: theme.PagePadding }]}>
      {/* Email */}
      <Text style={[styles.label, { color: theme.TextColor }]}>Email</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.AccentColor,
            color: theme.TextColor,
            borderRadius: theme.BorderRadius,
          },
        ]}
        placeholder="email@address.com"
        placeholderTextColor={theme.TextColor + "99"}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password */}
      <Text style={[styles.label, { color: theme.TextColor, marginTop: 16 }]}>
        Password
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.AccentColor,
            color: theme.TextColor,
            borderRadius: theme.BorderRadius,
          },
        ]}
        placeholder="••••••••"
        placeholderTextColor={theme.TextColor + "99"}
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {/* Sign In */}
      <TouchableOpacity
        style={[
          styles.submit,
          {
            backgroundColor: theme.USDColor,
            borderRadius: theme.BorderRadius,
            opacity: loading ? 0.6 : 1,
            marginTop: 24,
          },
        ]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={[styles.submitText, { color: theme.TextColor }]}>
          Sign In
        </Text>
      </TouchableOpacity>

      {/* Sign Up */}
      <TouchableOpacity
        style={[
          styles.submit,
          {
            backgroundColor: theme.AccentColor,
            borderRadius: theme.BorderRadius,
            opacity: loading ? 0.6 : 1,
            marginTop: 12,
          },
        ]}
        onPress={signUpWithEmail}
        disabled={loading}
      >
        <Text style={[styles.submitText, { color: theme.TextColor }]}>
          Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  submit: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
