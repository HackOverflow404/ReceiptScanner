// AvatarRefreshContext.tsx
import React, { createContext, useCallback, useContext, useState } from 'react';

const ctx = createContext<{ key: number; bump: () => void }>({
  key: 0, bump: () => {}
})

export function AvatarRefreshProvider({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0)
  const bump = useCallback(() => setKey(k => k+1), [])
  return <ctx.Provider value={{ key, bump }}>{children}</ctx.Provider>
}

export const useAvatarRefresh = () => useContext(ctx)