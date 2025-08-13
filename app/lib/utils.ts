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
