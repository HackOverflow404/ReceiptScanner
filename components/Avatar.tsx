import { useAvatarRefresh } from "@/contexts/AvatarRefreshContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { useIsFocused } from '@react-navigation/native';
import React, { memo, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AVATAR_BUCKET = "avatars";
const AVATAR_EXPIRY = 60; // seconds
const avatarCache: Record<string, { url: string; expiresAt: number }> = {};

export interface AvatarProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const Avatar = memo(function Avatar({
  size = 70,
  style,
}: AvatarProps) {
  const theme = useTheme();
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { key: refreshKey } = useAvatarRefresh()
  const lastRefreshKeyRef = useRef<any>(refreshKey);
  const isFocused = useIsFocused()

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    (async () => {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        console.error("No authenticated user");
        if (isMounted) {
          setUrl(null);
          setLoading(false);
        }
        return;
      }

      const cacheEntry = avatarCache[user.id];
      const shouldUseCache =
        cacheEntry &&
        Date.now() < cacheEntry.expiresAt &&
        lastRefreshKeyRef.current === refreshKey;
      if (shouldUseCache) {
        setUrl(cacheEntry.url);
        setLoading(false);
        return;
      }

      try {
        const filePath = `${user.id}/avatar`;
        const { data: signed, error } = await supabase.storage
          .from(AVATAR_BUCKET)
          .createSignedUrl(filePath, AVATAR_EXPIRY);
        if (error) throw error;
        const signedUrl = signed.signedUrl;
        console.log(signedUrl);

        // Prime RN’s cache
        Image.prefetch(signedUrl);

        if (isMounted) {
          setUrl(signedUrl);
          setLoading(false);
          avatarCache[user.id] = {
            url: signedUrl,
            expiresAt: Date.now() + AVATAR_EXPIRY * 1000,
          };
          lastRefreshKeyRef.current = refreshKey;
        }
      } catch (err: any) {
        console.error("Avatar load error:", err.message);
        if (isMounted) {
          setUrl(null);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, isFocused]);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: "hidden" as const,
  };

  // if (loading) {
  //   return (
  //     <View style={[containerStyle, styles.center, style]}> 
  //       <ActivityIndicator size="small" color={theme.TextColor} />
  //     </View>
  //   );
  // }

  if (!url) {
    return (
      <Icon
        name="account-circle"
        size={size}
        color={theme.TextColor}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <View style={[containerStyle, style]}> 
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size }}
        resizeMode="cover"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});