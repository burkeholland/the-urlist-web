import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { initializeTheme, toggleTheme, setTheme, theme, setupSystemThemeListener } from '../stores/theme';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// Mock matchMedia
const matchMediaMock = vi.fn(() => ({
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
}));

// Mock document
const documentMock = {
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
  },
};

describe('Theme Store', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup global mocks
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    Object.defineProperty(global, 'matchMedia', {
      value: matchMediaMock,
      writable: true,
    });
    
    Object.defineProperty(global, 'document', {
      value: documentMock,
      writable: true,
    });
    
    Object.defineProperty(global, 'window', {
      value: { matchMedia: matchMediaMock },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initializeTheme', () => {
    it('should use stored theme preference when available', () => {
      localStorageMock.getItem.mockReturnValue('dark');
      
      initializeTheme();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme-preference');
      expect(theme.get()).toBe('dark');
    });

    it('should use system preference when no stored preference', () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: true });
      
      initializeTheme();
      
      expect(theme.get()).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
    });

    it('should default to light theme when system prefers light', () => {
      localStorageMock.getItem.mockReturnValue(null);
      matchMediaMock.mockReturnValue({ matches: false });
      
      initializeTheme();
      
      expect(theme.get()).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'light');
    });

    it('should ignore invalid stored values', () => {
      localStorageMock.getItem.mockReturnValue('invalid');
      matchMediaMock.mockReturnValue({ matches: false });
      
      initializeTheme();
      
      expect(theme.get()).toBe('light');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      setTheme('light');
      
      toggleTheme();
      
      expect(theme.get()).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
    });

    it('should toggle from dark to light', () => {
      setTheme('dark');
      
      toggleTheme();
      
      expect(theme.get()).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'light');
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      setTheme('dark');
      
      expect(theme.get()).toBe('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'dark');
    });

    it('should set theme to light', () => {
      setTheme('light');
      
      expect(theme.get()).toBe('light');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme-preference', 'light');
    });
  });

  describe('DOM updates', () => {
    it('should add dark class when theme is dark', () => {
      setTheme('dark');
      
      // Trigger the computed store
      theme.get();
      
      expect(documentMock.documentElement.classList.add).toHaveBeenCalledWith('dark');
    });

    it('should remove dark class when theme is light', () => {
      setTheme('light');
      
      // Trigger the computed store
      theme.get();
      
      expect(documentMock.documentElement.classList.remove).toHaveBeenCalledWith('dark');
    });
  });

  describe('setupSystemThemeListener', () => {
    it('should setup media query listener', () => {
      const mediaQueryList = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      matchMediaMock.mockReturnValue(mediaQueryList);
      
      const cleanup = setupSystemThemeListener();
      
      expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      
      // Test cleanup
      cleanup?.();
      expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should update theme when system preference changes and no stored preference', () => {
      localStorageMock.getItem.mockReturnValue(null);
      const mediaQueryList = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      matchMediaMock.mockReturnValue(mediaQueryList);
      
      setupSystemThemeListener();
      
      // Simulate system theme change
      const changeHandler = mediaQueryList.addEventListener.mock.calls[0][1];
      changeHandler({ matches: true });
      
      expect(theme.get()).toBe('dark');
    });

    it('should not update theme when stored preference exists', () => {
      localStorageMock.getItem.mockReturnValue('light');
      const mediaQueryList = {
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };
      matchMediaMock.mockReturnValue(mediaQueryList);
      
      setTheme('light');
      setupSystemThemeListener();
      
      // Simulate system theme change
      const changeHandler = mediaQueryList.addEventListener.mock.calls[0][1];
      changeHandler({ matches: true });
      
      // Theme should remain light because user has a stored preference
      expect(theme.get()).toBe('light');
    });
  });
});