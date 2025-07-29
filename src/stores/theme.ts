import { atom, computed } from 'nanostores';

export type Theme = 'light' | 'dark';

// Internal store for the theme
const themeAtom = atom<Theme>('light');

// Computed store that also handles DOM updates
export const theme = computed(themeAtom, (currentTheme) => {
  // Only update DOM if we're in the browser
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
  return currentTheme;
});

// Function to toggle theme
export function toggleTheme() {
  const current = themeAtom.get();
  const newTheme = current === 'light' ? 'dark' : 'light';
  themeAtom.set(newTheme);
  
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme-preference', newTheme);
  }
}

// Function to set theme directly
export function setTheme(newTheme: Theme) {
  themeAtom.set(newTheme);
  
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme-preference', newTheme);
  }
}

// Function to initialize theme from localStorage or system preference
export function initializeTheme() {
  if (typeof window === 'undefined') return;
  
  // Check localStorage first
  const stored = localStorage.getItem('theme-preference') as Theme;
  if (stored && (stored === 'light' || stored === 'dark')) {
    themeAtom.set(stored);
    return;
  }
  
  // Fall back to system preference
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const systemTheme = systemPrefersDark ? 'dark' : 'light';
  themeAtom.set(systemTheme);
  localStorage.setItem('theme-preference', systemTheme);
}

// Listen for system theme changes
export function setupSystemThemeListener() {
  if (typeof window === 'undefined') return;
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleChange = (e: MediaQueryListEvent) => {
    // Only update if user hasn't set a preference
    const stored = localStorage.getItem('theme-preference');
    if (!stored) {
      const newTheme = e.matches ? 'dark' : 'light';
      themeAtom.set(newTheme);
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
}