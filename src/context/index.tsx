import React from 'react';
import { NotificationStack } from '../components/Notification';
import { Theme } from '../const';

interface LibraryContextType {
  theme: Theme;
  toggleTheme?: () => void;
}

const LibraryContext = React.createContext<LibraryContextType | undefined>(
  undefined,
);

export const useMisDesignContext = (): LibraryContextType => {
  const context = React.useContext(LibraryContext);
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

interface MisDesignProviderProps {
  defaultTheme?: Theme;
  theme?: Theme;
  children: React.ReactNode;
}

export const MisDesignProvider = ({
  defaultTheme = Theme.LIGHT,
  theme: themeProp,
  children,
}: MisDesignProviderProps) => {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(() => {
    if (themeProp) return themeProp === Theme.DARK;

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    // return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return defaultTheme === Theme.DARK;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  React.useEffect(() => {
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

  const value = React.useMemo(
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
