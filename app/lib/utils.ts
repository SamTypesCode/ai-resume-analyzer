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

// Function to generate a unique UUID
export const generateUUID = () => crypto.randomUUID();

// Simple helper to pause for N ms
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
