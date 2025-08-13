import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/lib/utils";

// Props to make Typescript stop screaming
interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
  fileUploadError?: boolean;
}

// Export the file uploader component for use in upload page
const FileUploader = ({ onFileSelect, fileUploadError }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Function to handle file drag and drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      setSelectedFile(file);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  // Max file size as 20 MB
  const maxFileSize = 20 * 1024 * 1024;

  // Settings for react-dropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false, // Only allow one file to be selectable
    accept: { "application/pdf": [".pdf"] }, // Only accept PDF files
    maxSize: maxFileSize, // Max file size should be 20 MB
  });

  return (
    <div className="w-full">
      {selectedFile ? (
        // Show selected file info
        <div className="flex items-center justify-between p-4 border border-neutral-300 rounded-xl bg-neutral-50">
          <div className="flex items-center space-x-4 min-w-0">
            <img
              src="/images/pdf.png"
              alt="pdf icon"
              className="w-10 h-10 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-neutral-700 truncate">
                {selectedFile.name}
              </p>
              <p className="text-sm text-neutral-500">
                {formatSize(selectedFile.size)}
              </p>
            </div>
          </div>
          {/* Button to remove the selected file */}
          <button
            className="p-2 cursor-pointer rounded transition flex-shrink-0 hover:bg-neutral-200"
            onClick={() => {
              setSelectedFile(null);
              onFileSelect?.(null);
            }}
          >
            <img src="/icons/cross.svg" alt="remove file" className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // Show upload dropzone if no file is selected
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center h-64 w-full cursor-pointer rounded-xl border-2 border-dashed  text-center transition ${fileUploadError ? "border-red-300 bg-red-50 hover:bg-red-100" : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-neutral-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-base text-neutral-600">
              <span className="font-semibold">Click to upload</span> or drag and
              drop your PDF
            </p>
            <p className="text-sm text-neutral-500">PDF only, max 20MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
