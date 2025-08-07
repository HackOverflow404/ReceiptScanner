// AvatarRefreshContext.tsx
import React, { createContext, useCallback, useContext, useState } from "react";

const ctx = createContext<{
  key: number;
  uri: {uri: string, expiresAt: number};
  bump: (uri?: string) => void;
}>({
  key: 0,
  uri: {uri: "", expiresAt: 0},
  bump: (uri) => {},
});

export function AvatarRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [key, setKey] = useState(0);
  const [uri, setUri] = useState({
    uri: "",
    expiresAt: 0,
  });
  const bump = useCallback((localUri?: string) => {
    console.log(localUri);
    if (localUri) {
      setUri({ uri: localUri, expiresAt: Date.now() + 6000 });
    }
    setKey(k => k + 1);
  }, []);
  return <ctx.Provider value={{ key, uri, bump }}>{children}</ctx.Provider>;
}

export const useAvatarRefresh = () => useContext(ctx);
