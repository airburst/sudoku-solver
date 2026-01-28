import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for constructing className strings conditionally.
 * Combines clsx for conditional classes with tailwind-merge
 * to properly merge Tailwind CSS classes without conflicts.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
