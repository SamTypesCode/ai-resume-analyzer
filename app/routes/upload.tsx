import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { convertPdfToImage } from "~/lib/pdf2img";

// Define the meta deta such as page title and description for SEO
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload Resume for AI Analysis" },
    {
      name: "description",
      content:
        "Upload your resume, job title, company name, and job description to run a private, AI-powered analysis. No data is stored, your resume is processed securely in your browser.",
    },
  ];
}

// Return the default upload page component
export default function Upload() {
  // State for storing whether the resume is being actively processed or not
  const [isProcessing, setIsProcessing] = useState(false);
  // State for storing the status message which will tell the user what is currently being processed
  const [statusText, setStatusText] = useState("");
  // State for storing the PDF file uploaded by the user
  const [file, setFile] = useState<File | null>(null);

  // Feed the user input to the AI and
  const processData = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    // Set the processing variable as true so the UI changes
    setIsProcessing(true);

    // Convert the first page of the PDF into an image so it can be sent to the AI
    setStatusText("Converting PDF to image");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file) return setStatusText("Failed to convert PDF to image");

    // TODO: Send the image with a prompt to an AI model to generate the review
    // TODO: Save the PDF, Image and the AI generated review using idb-keyval
    // TODO: Redirect to the review page
  };

  // Function for handling form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget.closest("form"); // Find the form element
    if (!form) return; // Return if theres no form element nearby
    const formData = new FormData(form); // Retrieve the form data input by the user

    // Get the input put by the user in the form fields
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    // Don't proceed if the user has not uploaded a file
    if (!file) return;

    // Process the user input data
    processData({ companyName, jobTitle, jobDescription, file });
  };

  // File select function to be passed to the file uploader component
  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white !pt-0">
      {/* A simple bar at the top with a button for going back to the home page */}
      <nav className="flex flex-row sticky top-0 bg-white/90 backdrop-blur-lg justify-between items-center p-4 border-b border-neutral-200 z-10">
        <Link
          to="/"
          className="flex flex-row items-center gap-2 border border-neutral-200 rounded-lg p-2 shadow-sm bg-white"
        >
          <span className="text-neutral-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex-1 w-full flex flex-col px-4">
        {isProcessing ? (
          <></>
        ) : (
          <>
            <section className="w-full flex flex-col items-center justify-center px-4 pt-16 pb-16 text-center">
              <div className="w-full max-w-lg">
                <p className="text-5xl md:text-6xl leading-tight tracking-[-2px] font-semibold text-neutral-900">
                  Get smart AI feedback for your dream job
                </p>
                <h2 className="mt-4 !text-neutral-600">
                  Upload your resume and get an ATS score, detailed suggestions,
                  and improvement tips.
                </h2>
              </div>
            </section>
            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center pb-12">
              <form
                id="upload-form"
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent page reload and URL update
                  handleSubmit(e);
                }}
                className="w-full space-y-0-2"
              >
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="company-name"
                    className="text-base font-medium text-neutral-800 mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company-name"
                    name="company-name"
                    placeholder="Ex: OpenAI"
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="job-title"
                    className="text-base font-medium text-neutral-800 mb-1"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="job-title"
                    name="job-title"
                    placeholder="Ex: Software Engineer"
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="job-description"
                    className="text-base font-medium text-neutral-800 mb-1"
                  >
                    Job Description
                  </label>
                  <textarea
                    id="job-description"
                    name="job-description"
                    rows={5}
                    placeholder="Paste the job description here"
                    className="w-full border border-neutral-300 rounded-lg px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
                  />
                </div>

                <div className="flex flex-col w-full space-y-2">
                  <label className="text-base font-medium text-neutral-800">
                    Your Resume (PDF)
                  </label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>
                <button
                  type="submit"
                  className="group cursor-pointer relative w-full overflow-hidden rounded-[8px] border border-transparent bg-neutral-950 px-4 text-white"
                >
                  <span className="relative inline-flex py-3">
                    <span className="duration-700 [transition-delay:0.02s] group-hover:[transform:rotateX(360deg)]">
                      R
                    </span>
                    <span className="duration-700 [transition-delay:0.04s] group-hover:[transform:rotateX(360deg)]">
                      e
                    </span>
                    <span className="duration-700 [transition-delay:0.06s] group-hover:[transform:rotateX(360deg)]">
                      v
                    </span>
                    <span className="duration-700 [transition-delay:0.08s] group-hover:[transform:rotateX(360deg)]">
                      i
                    </span>
                    <span className="duration-700 [transition-delay:0.10s] group-hover:[transform:rotateX(360deg)]">
                      e
                    </span>
                    <span className="duration-700 [transition-delay:0.12s] group-hover:[transform:rotateX(360deg)]">
                      w
                    </span>
                    {/* Space */}
                    <span className="duration-700 [transition-delay:0.14s] group-hover:[transform:rotateX(360deg)]">
                      &nbsp;
                    </span>
                    <span className="duration-700 [transition-delay:0.16s] group-hover:[transform:rotateX(360deg)]">
                      m
                    </span>
                    <span className="duration-700 [transition-delay:0.18s] group-hover:[transform:rotateX(360deg)]">
                      y
                    </span>
                    {/* Space */}
                    <span className="duration-700 [transition-delay:0.20s] group-hover:[transform:rotateX(360deg)]">
                      &nbsp;
                    </span>
                    <span className="duration-700 [transition-delay:0.22s] group-hover:[transform:rotateX(360deg)]">
                      R
                    </span>
                    <span className="duration-700 [transition-delay:0.24s] group-hover:[transform:rotateX(360deg)]">
                      e
                    </span>
                    <span className="duration-700 [transition-delay:0.26s] group-hover:[transform:rotateX(360deg)]">
                      s
                    </span>
                    <span className="duration-700 [transition-delay:0.28s] group-hover:[transform:rotateX(360deg)]">
                      u
                    </span>
                    <span className="duration-700 [transition-delay:0.30s] group-hover:[transform:rotateX(360deg)]">
                      m
                    </span>
                    <span className="duration-700 [transition-delay:0.32s] group-hover:[transform:rotateX(360deg)]">
                      e
                    </span>
                  </span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
