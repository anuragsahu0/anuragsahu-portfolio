import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally combine CSS classes with Tailwind class deduplication.
 * @param {...(string|object|Array)} inputs - Class names or conditional class objects
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
