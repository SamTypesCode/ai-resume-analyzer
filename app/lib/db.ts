// Import helper functions from idb-keyval to store and retrieve values in the browser's IndexedDB
import { set, get } from "idb-keyval";

// Function for storing a Resume object, a PDF and an Image into the IndexedDB
export async function saveResume(
  resume: Resume,
  pdf: File | Blob,
  image: File | Blob
): Promise<{ success: boolean; error?: string }> {
  const data = {
    ...resume,
    pdfBlob: pdf,
    imageBlob: image,
  };

  try {
    await set("resume_" + resume.id, data); // Store with 'resume_' prefix
    return { success: true };
  } catch (err) {
    console.error("[saveResume] Failed to save resume:", err);
    return { success: false, error: (err as Error).message || "Unknown error" };
  }
}

// Function for getting the Resume object, the PDF and the Image from the IndexedDB
export async function getResume(
  id: string
): Promise<(Resume & { pdfBlob: Blob; imageBlob: Blob }) | null> {
  try {
    const data = await get<Resume & { pdfBlob: Blob; imageBlob: Blob }>(
      "resume_" + id
    );
    return data ?? null;
  } catch (err) {
    console.error("[getResume] Failed to get resume:", err);
    return null;
  }
}
