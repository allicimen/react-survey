import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Varsayılan olarak localStorage'dan oku, yoksa 'light' yap
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'light');

  useEffect(() => {
    // HTML etiketine 'data-theme' özelliğini ekle (CSS bunu yakalayacak)
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);