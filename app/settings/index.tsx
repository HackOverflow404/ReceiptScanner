import { Avatar } from "@/components/Avatar";
import { ThemedView } from "@/components/ThemedView";
import { useAvatarRefresh } from "@/contexts/AvatarRefreshContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const BUCKET = "user-configs";

export default function Settings() {
  const theme = useTheme();
  const { bump } = useAvatarRefresh()

  // keep user around so we don't call getUser() repeatedly
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [initEmail, setInitEmail] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) return console.error(error);
      setUser({ id: user.id, email: user.email! });
      setEmail(user.email!);
      setInitEmail(user.email!);
    });
  }, []);

  // Handler: upload & overwrite with upsert, then bump avatarKey
  const handleChangeAvatar = useCallback(async () => {
    if (!user) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) return;
      Alert.alert(
        'Updating Profile Picture',
        'Your new avatar is being uploaded and may take up to a minute to appear.'
      );

      const localUri = result.assets[0].uri;
      bump(localUri);
      const resp = await fetch(localUri);
      const blob = await resp.blob();
      const buffer = await new Response(blob).arrayBuffer();

      const filePath = `${user.id}/avatar`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, buffer, {
          upsert: true,
          contentType: blob.type,
          metadata: { owner: user.id },
        });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error("Avatar Upload Error", err);
      Alert.alert("Failed to upload avatar", err.message);
    }

    bump();
  }, [bump, user]);

  const handleSaveChanges = useCallback(async () => {
    if (!user || email === initEmail) return;
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      console.error(error);
      Alert.alert("Error updating email", error.message);
    } else {
      Alert.alert("Verification email sent");
      setInitEmail(email);
    }
  }, [email, initEmail, user]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.replace("/");
  }, []);

  return (
    <ThemedView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="keyboard-return" size={28} color={theme.TextColor} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.USDColor }]}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Avatar */}
      <TouchableOpacity style={styles.avatar} onPress={handleChangeAvatar}>
        <Avatar size={175} />
      </TouchableOpacity>

      {/* Email */}
      <View>
        <Text style={[styles.label, { color: theme.TextColor }]}>Email</Text>
        <TextInput
          style={[
            styles.email,
            {
              backgroundColor: theme.AccentColor,
              color: theme.TextColor,
              borderRadius: theme.BorderRadius,
            },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="email@address.com"
          placeholderTextColor={theme.TextColor + "99"}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.USDColor,
            borderRadius: theme.BorderRadius,
          },
        ]}
        onPress={handleSaveChanges}
      >
        <Text style={[styles.buttonText, { color: theme.TextColor }]}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: theme.AccentColor,
            borderRadius: theme.BorderRadius,
          },
        ]}
        onPress={handleSignOut}
      >
        <Icon
          name="exit-to-app"
          size={24}
          color={theme.TextColor}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.buttonText, { color: theme.TextColor }]}>Sign Out</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 4,
    borderRadius: 24,
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 30,
  },
  avatarImage: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    overflow: "hidden",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
  },
  body: {
    flex: 1,
    justifyContent: "flex-start",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    paddingHorizontal: 20,
  },
  email: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 40,
    flexDirection: "row",
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
