import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge multiple class names with Tailwind CSS support.
 * This utility combines the clsx and tailwind-merge libraries to allow
 * easy conditional class joining with proper Tailwind precedence.
 * 
 * @param inputs - Class names or conditional class expressions
 * @returns Merged class string with proper Tailwind handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
