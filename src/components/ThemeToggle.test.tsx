import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeToggle } from './ThemeToggle';

// Mock the theme store
vi.mock('../stores/theme', () => ({
  theme: {
    get: vi.fn(() => 'light'),
    subscribe: vi.fn((callback) => {
      callback('light');
      return () => {}; // unsubscribe function
    }),
  },
  toggleTheme: vi.fn(),
  initializeTheme: vi.fn(),
  setupSystemThemeListener: vi.fn(() => () => {}), // return cleanup function
}));

// Mock useStore from @nanostores/react
vi.mock('@nanostores/react', () => ({
  useStore: vi.fn(() => 'light'),
}));

import { toggleTheme, initializeTheme, setupSystemThemeListener } from '../stores/theme';
import { useStore } from '@nanostores/react';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the theme toggle button', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('shows sun icon when theme is light', () => {
    (useStore as any).mockReturnValue('light');
    
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveAttribute('title', 'Switch to dark mode');
  });

  it('shows moon icon when theme is dark', () => {
    (useStore as any).mockReturnValue('dark');
    
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(button).toHaveAttribute('title', 'Switch to light mode');
  });

  it('calls toggleTheme when clicked', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('initializes theme on mount', () => {
    render(<ThemeToggle />);
    
    expect(initializeTheme).toHaveBeenCalledTimes(1);
    expect(setupSystemThemeListener).toHaveBeenCalledTimes(1);
  });

  it('cleans up system theme listener on unmount', () => {
    const cleanupMock = vi.fn();
    (setupSystemThemeListener as any).mockReturnValue(cleanupMock);
    
    const { unmount } = render(<ThemeToggle />);
    unmount();
    
    expect(cleanupMock).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('title');
  });

  it('applies hover and focus styles', () => {
    render(<ThemeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:scale-110');
    expect(button).toHaveClass('focus:outline-none');
    expect(button).toHaveClass('focus:ring-2');
  });

  it('shows correct icon opacity based on theme', () => {
    const { rerender } = render(<ThemeToggle />);
    
    // Test light theme
    (useStore as any).mockReturnValue('light');
    rerender(<ThemeToggle />);
    
    const sunIcon = screen.getByRole('button').querySelector('svg[class*="opacity-100"]');
    expect(sunIcon).toBeInTheDocument();
    
    // Test dark theme
    (useStore as any).mockReturnValue('dark');
    rerender(<ThemeToggle />);
    
    // In dark mode, the moon icon should have opacity-100
    const moonIcon = screen.getByRole('button').querySelector('svg[class*="opacity-100"]');
    expect(moonIcon).toBeInTheDocument();
  });
});