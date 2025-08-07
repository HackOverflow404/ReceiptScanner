import { useTheme } from "@/contexts/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View
} from "react-native";
import EmailForm from "./EmailForm";

export default function Auth() {
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  async function signInWithGoogle() {
    setLoading(true);
    try {
      const redirectUri = makeRedirectUri({ scheme: "receiptscanner" });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;

      if (data?.url) {
        await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      }
    } catch (err: any) {
      Alert.alert("Sign-in error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      {/* Email / Password */}
      <EmailForm />

      {/*
      {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={theme.BorderRadius}
          style={styles.button}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              if (!credential.identityToken) {
                throw new Error("No identity token returned");
              }
              const {
                data: { user },
                error,
              } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              });
              if (error || !user) throw error ?? new Error("Sign-in failed");
            } catch (e: any) {
              if (e.code === "ERR_REQUEST_CANCELED") {
                // user cancelled
              } else {
                Alert.alert("Apple sign-in error", e.message || String(e));
              }
            }
          }}
        />
      )}
      
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: "#000", // or theme.AccentColor
            borderRadius: theme.BorderRadius,
            opacity: loading ? 0.6 : 1,
            marginTop: 12,
          },
        ]}
        onPress={() => signInWithGoogle()}
        disabled={loading}
      >
        <Text style={[styles.submitText, { color: theme.TextColor }]}>
          Sign in with Google
        </Text>
      </TouchableOpacity>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
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
