import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState
} from 'react';

export interface Theme {
  PageColor: string;
  USDColor: string;
  TextColor: string;
  AccentColor: string;
  PagePadding: number;
  TopPadding: number;
  BorderRadius: number;
}

export type PartialTheme = Partial<Theme>;

const defaultTheme: Theme = {
  PageColor: "#23272A",
  USDColor: "#0580D1",
  TextColor: "#FFFFFF",
  AccentColor: "#2D2F33",
  PagePadding: 35,
  TopPadding: 70,
  BorderRadius: 15,
};

const lightTheme1: Theme = {
  PageColor: "#EAF4FF",
  USDColor: "#85BB65",
  TextColor: "#000000",
  AccentColor: "#2D2F33",
  PagePadding: 35,
  TopPadding: 70,
  BorderRadius: 15,
};

const ThemeContext = createContext<Theme | undefined>(undefined);
const UpdateThemeContext = createContext<(newTheme: PartialTheme) => void>(() => {
  throw new Error("useUpdateTheme must be used within a ThemeProvider");
});

export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export const useUpdateTheme = (): (newTheme: PartialTheme) => void => {
  return useContext(UpdateThemeContext);
};

// 5. Provider
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeValues, setThemeValues] = useState<Theme>(defaultTheme);

  const changeTheme = (newTheme: PartialTheme) => {
    setThemeValues((prev) => ({ ...prev, ...newTheme }));
  };

  const themeMemo = useMemo(() => themeValues, [themeValues]);

  return (
    <ThemeContext.Provider value={themeMemo}>
      <UpdateThemeContext.Provider value={changeTheme}>
        {children}
      </UpdateThemeContext.Provider>
    </ThemeContext.Provider>
  );
};