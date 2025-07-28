// Utility function for combining classnames
// Basic implementation without external dependencies for now
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(' ');
}