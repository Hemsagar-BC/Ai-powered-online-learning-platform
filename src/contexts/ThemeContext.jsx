import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { storageService } from '../lib/storage.service';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [accentColor, setAccentColor] = useState('purple');
  const [isLoading, setIsLoading] = useState(true);

  // Theme sizes
  const fontSizes = {
    small: {
      base: '14px',
      heading: '1.125rem',
      title: '1.5rem',
      display: '2.25rem'
    },
    medium: {
      base: '16px',
      heading: '1.25rem',
      title: '1.875rem',
      display: '2.5rem'
    },
    large: {
      base: '18px',
      heading: '1.5rem',
      title: '2.25rem',
      display: '3rem'
    }
  };

  // Accent colors
  const accentColors = {
    purple: {
      primary: '#a855f7',
      secondary: '#ec4899',
      light: '#e9d5ff',
      dark: '#6b21a8'
    },
    blue: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      light: '#dbeafe',
      dark: '#1e40af'
    },
    green: {
      primary: '#10b981',
      secondary: '#14b8a6',
      light: '#d1fae5',
      dark: '#047857'
    },
    orange: {
      primary: '#f97316',
      secondary: '#f59e0b',
      light: '#fed7aa',
      dark: '#c2410c'
    }
  };

  // Load theme preferences on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedPreferences = storageService.getPreferences();
        if (savedPreferences) {
          setIsDarkMode(savedPreferences.isDarkMode || false);
          setFontSize(savedPreferences.fontSize || 'medium');
          setAccentColor(savedPreferences.accentColor || 'purple');
        }

        // Check system preference
        if (
          !savedPreferences?.isDarkMode &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          setIsDarkMode(true);
        }
      } catch (err) {
        console.error('Error loading theme preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (isLoading) return;

    // Update localStorage
    storageService.savePreferences({
      isDarkMode,
      fontSize,
      accentColor
    });

    // Update DOM
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }

    // Update CSS variables
    const colors = accentColors[accentColor] || accentColors.purple;
    htmlElement.style.setProperty('--color-primary', colors.primary);
    htmlElement.style.setProperty('--color-secondary', colors.secondary);
    htmlElement.style.setProperty('--color-light', colors.light);
    htmlElement.style.setProperty('--color-dark', colors.dark);

    const sizes = fontSizes[fontSize] || fontSizes.medium;
    htmlElement.style.setProperty('--font-size-base', sizes.base);
    htmlElement.style.setProperty('--font-size-heading', sizes.heading);
    htmlElement.style.setProperty('--font-size-title', sizes.title);
    htmlElement.style.setProperty('--font-size-display', sizes.display);
  }, [isDarkMode, fontSize, accentColor, isLoading]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Set font size
  const setThemeFontSize = (size) => {
    if (fontSizes[size]) {
      setFontSize(size);
    }
  };

  // Set accent color
  const setThemeAccentColor = (color) => {
    if (accentColors[color]) {
      setAccentColor(color);
    }
  };

  // Reset to defaults
  const resetTheme = () => {
    setIsDarkMode(false);
    setFontSize('medium');
    setAccentColor('purple');
  };

  const value = {
    isDarkMode,
    fontSize,
    accentColor,
    isLoading,
    fontSizes,
    accentColors,
    toggleDarkMode,
    setThemeFontSize,
    setThemeAccentColor,
    resetTheme,
    currentColors: accentColors[accentColor] || accentColors.purple,
    currentFontSizes: fontSizes[fontSize] || fontSizes.medium
  };

  return (
    <ThemeContext.Provider value={value}>
      {!isLoading && children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeContext;
