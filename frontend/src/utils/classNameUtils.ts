import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes and twMerge for proper Tailwind precedence
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', 'hover:bg-blue-600')
 * // Returns: "px-2 py-1 bg-blue-500 hover:bg-blue-600" (if isActive is true)
 *
 * @example
 * // Properly handles conflicting classes
 * cn('px-2', 'px-4')
 * // Returns: "px-4" (later class wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
