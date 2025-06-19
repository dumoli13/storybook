import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NotificationStack } from '../components/Notification';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

interface LibraryContextType {
  theme: Theme;
  toggleTheme?: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const useMisDesignContext = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    // throw new Error('UseContext must be used within a LibraryContext');
    const theme = document.documentElement.classList.contains('dark')
      ? Theme.DARK
      : Theme.LIGHT;
    return {
      theme,
    };
  }
  return context;
};

export const MisDesignProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  const value = useMemo(
    () => ({
      theme: isDarkMode ? Theme.DARK : Theme.LIGHT,
      toggleTheme: () => setIsDarkMode((prev) => !prev),
    }),
    [isDarkMode],
  );

  return (
    <LibraryContext.Provider value={value}>
      {children}
      <NotificationStack />
    </LibraryContext.Provider>
  );
};

export default MisDesignProvider;
