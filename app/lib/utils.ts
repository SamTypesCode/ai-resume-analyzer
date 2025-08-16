import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Cn helper function for merging TailwindCSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get a color from a score number
export const scoreColor = (score: number) => {
  const clamped = Math.min(Math.max(score, 0), 100);

  if (clamped < 50)
    return "#ef4444"; // red-500
  else if (clamped < 80)
    return "#eab308"; // yellow-500
  else return "#22c55e"; // green-500
};

// Function to turn amount of bytes into a string in the form of KB, MB, GB etc
export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Function to generate a unique UUID with fallback for mobile browsers
export const generateUUID = (): string => {
  // Try to use the native crypto.randomUUID if available
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    try {
      return crypto.randomUUID();
    } catch (error) {
      console.warn(
        "crypto.randomUUID failed, falling back to manual generation:",
        error
      );
    }
  }

  // Fallback implementation for browsers that don't support crypto.randomUUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Simple helper to pause for N ms
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
