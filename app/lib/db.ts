// Import helper functions from idb-keyval to store and retrieve values in the browser's IndexedDB
import { set, get } from "idb-keyval";

// Function for storing a Resume object, a PDF and an Image into the IndexedDB
export async function saveResume(
  resume: Resume,
  pdf: File | Blob,
  image: File | Blob
) {
  const data = {
    ...resume,
    pdfBlob: pdf,
    imageBlob: image,
  };
  return set("resume_" + resume.id, data); // Data is stored with the prefix 'resume_'
}

// Function for getting the Resume object, the PDF and the Image from the IndexedDB
export async function getResume(
  id: string
): Promise<(Resume & { pdfBlob: Blob; imageBlob: Blob }) | null> {
  const data = await get<Resume & { pdfBlob: Blob; imageBlob: Blob }>(
    "resume_" + id
  );
  return data ?? null;
}
