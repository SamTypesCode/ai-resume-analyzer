// what we send back after converting
export interface PdfConversionResult {
  imageUrl: string; // url to show img
  file: File | null; // actual img file
  error?: string; // if stuff breaks
}

let pdfjsLib: any = null; // cache lib
let isLoading = false; // flag if loading rn
let loadPromise: Promise<any> | null = null; // reuse load promise

// load pdf.js on demand
async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib; // already loaded
  if (loadPromise) return loadPromise; // already loading

  isLoading = true;

  loadPromise = import("pdfjs-dist/build/pdf.mjs").then(async (lib) => {
    const { default: workerUrl } = await import(
      "pdfjs-dist/build/pdf.worker.mjs?url"
    );

    lib.GlobalWorkerOptions.workerSrc = workerUrl; // set worker
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  });

  return loadPromise;
}

// turn page 1 of pdf into png
export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    // bigger scale = better quality
    const viewport = page.getViewport({ scale: 4 });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
    }

    // draw pdf page to canvas
    await page.render({ canvasContext: context!, viewport }).promise;

    // turn canvas to blob + file
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: "",
              file: null,
              error: "couldn’t make img blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("[convertPdfToImage] fail:", err);
    return {
      imageUrl: "",
      file: null,
      error: `fail: ${(err as Error).message}`,
    };
  }
}
