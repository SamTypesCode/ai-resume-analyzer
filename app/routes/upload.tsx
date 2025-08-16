import { Link, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useState, type FormEvent } from "react";
import FileUploader from "~/components/FileUploader";
import { convertPdfToImage } from "~/lib/pdf2img";
import { delay, generateUUID } from "~/lib/utils";
import { prepareInstructions } from "~/lib/constants";
import { analyzeWithGemini } from "~/lib/gemini";
import { saveResume } from "~/lib/db";

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
  // Will be used to redirect to the resume review page later
  const navigate = useNavigate();
  // State for storing whether the resume is being actively processed or not
  const [isProcessing, setIsProcessing] = useState(false);
  // State for storing the status message which will tell the user what is currently being processed
  const [statusText, setStatusText] = useState("");
  // State for storing the PDF file uploaded by the user
  const [file, setFile] = useState<File | null>(null);
  // State for storing whether the user pressed submit without selecting a file
  const [fileUploadError, setFileUploadError] = useState(false);
  // New state for tracking if any processing error occurred
  const [processingError, setProcessingError] = useState(false);

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
    try {
      // Set the processing variable as true so the UI changes
      setIsProcessing(true);
      // Reset processing error at the start
      setProcessingError(false);

      // Convert the first page of the PDF into an image so it can be sent to the AI
      setStatusText("Converting PDF to image");
      await delay(1000);
      let imageFile;
      try {
        imageFile = await convertPdfToImage(file);
        if (!imageFile.file) {
          setStatusText("Failed to convert PDF to image");
          setProcessingError(true);
          return;
        }
      } catch (err) {
        console.error("Error converting PDF:", err);
        setStatusText("Failed to convert PDF to image");
        setProcessingError(true);
        return;
      }

      // Prepare the data object for storing
      setStatusText("Preparing data");
      await delay(1000);
      let uuid;
      let resume;
      try {
        uuid = generateUUID();
        resume = {
          id: uuid,
          companyName,
          jobTitle,
          jobDescription,
          feedback: null,
        } as Resume;
      } catch (err) {
        console.error("Error preparing data:", err);
        setStatusText("Failed to prepare data");
        setProcessingError(true);
        return;
      }

      // Prepare AI prompt
      setStatusText("Preparing instructions");
      await delay(1000);
      let prompt;
      try {
        prompt = prepareInstructions({ companyName, jobTitle, jobDescription });
        if (!prompt) {
          setStatusText("Failed to prepare instructions");
          setProcessingError(true);
          return;
        }
      } catch (err) {
        console.error("Error preparing instructions:", err);
        setStatusText("Failed to prepare instructions");
        setProcessingError(true);
        return;
      }

      // Send data to AI
      setStatusText("Analyzing");
      let geminiResponse;
      try {
        geminiResponse = await analyzeWithGemini(imageFile.file, prompt);
        if (!geminiResponse) {
          setStatusText("Failed to analyze resume");
          setProcessingError(true);
          return;
        }
      } catch (err) {
        console.error("Error analyzing with Gemini:", err);
        setStatusText("Failed to analyze resume");
        setProcessingError(true);
        return;
      }

      // Turn the AI's response into a JSON object so the values inside can be accesed and the data can be mapped over
      setStatusText("Parsing AI response");
      await delay(1000);
      try {
        const cleaned = geminiResponse
          .replace(/^```(?:json)?/, "")
          .replace(/```$/, "")
          .trim();
        resume.feedback = JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse Gemini response:", err);
        setStatusText("Failed to parse AI response");
        setProcessingError(true);
        return;
      }

      // Save the AI's response, the PDF file and the image in the local IndexedDB using idb-keyval
      setStatusText("Saving");
      await delay(1000);
      const saveResult = await saveResume(resume, file, imageFile.file);
      if (!saveResult.success) {
        setStatusText("Failed to save resume: " + saveResult.error);
        setProcessingError(true);
        return;
      }

      // Redirect to the resume review page
      setStatusText("Redirecting");
      await delay(1000);
      navigate(`/resume/${uuid}`);
    } catch (err) {
      console.error("Unexpected error in processData:", err);
      setStatusText("Something went wrong. Please try again.");
      setProcessingError(true);
    } finally {
      // Stop the spinner if there’s an error, otherwise spinner remains until navigate
      if (!processingError) setIsProcessing(false);
    }
  };

  // Function for handling form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Prevent the default browser form submission (prevents page refresh)
    e.preventDefault();

    // Stop the event from bubbling up to parent elements or router handlers
    e.stopPropagation();

    // Check if a file has been uploaded
    if (!file) {
      // If device supports vibration, vibrate the device
      if ("vibrate" in navigator) navigator.vibrate(200);

      // Mark the file uploader as having an error
      setFileUploadError(true);

      // Display an error message to the user
      setStatusText("Please upload a resume file.");
      setProcessingError(true);
      return;
    }

    // Reset any previous file upload error
    setFileUploadError(false);

    try {
      // Collect form data from the event's current target (the form element)
      const formData = new FormData(e.currentTarget);

      // Extract input values from form data
      const companyName = formData.get("company-name") as string;
      const jobTitle = formData.get("job-title") as string;
      const jobDescription = formData.get("job-description") as string;

      // Process the user input and PDF with AI
      await processData({ companyName, jobTitle, jobDescription, file });
    } catch (err) {
      console.error("Unhandled error in handleSubmit:", err);
      setStatusText("Something went wrong. Please try again.");
      setProcessingError(true);
    }
  };

  // File select function to be passed to the file uploader component
  const handleFileSelect = (file: File | null) => {
    setFileUploadError(false);
    setFile(file);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white px-4">
      {/* Top navigation bar */}
      <nav className="flex flex-row sticky top-0 bg-white/90 backdrop-blur-lg justify-between items-center py-4 border-b border-neutral-200 z-50">
        <Link
          to="/"
          className="flex flex-row items-center gap-2 border border-neutral-200 rounded-lg p-2 shadow-sm bg-white"
        >
          <span className="text-neutral-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      {/* Main content */}
      <div className="flex-1 w-full max-w-screen-xl mx-auto h-full flex items-start flex-col pt-12 pb-[calc(2.5rem+env(safe-area-inset-bottom))] max-lg:pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
        {/* Show spinner + status if processing OR if an error occurred */}
        {isProcessing || processingError ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Spinner animation */}
            <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-800 rounded-full animate-spin"></div>
            <div className="text-neutral-600 text-lg tracking-wide mt-4">
              {statusText || "An error occurred. Please try again."}
            </div>
          </div>
        ) : (
          <>
            {/* Form UI */}
            <section className="w-full flex flex-col items-center justify-center text-left pl-1">
              <div className="w-full max-w-lg">
                <p className="text-5xl md:text-6xl leading-tight tracking-[-2px] font-semibold text-neutral-900">
                  Get smart AI feedback for your dream job
                </p>
                <p className="!text-neutral-600 mt-4 text-2xl">
                  Upload your resume and get an ATS score, detailed suggestions,
                  and improvement tips.
                </p>
              </div>
            </section>

            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center mt-8">
              <form id="upload-form" onSubmit={handleSubmit} className="w-full">
                <div className="flex flex-col w-full gap-6">
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="company-name"
                      className="text-base font-medium text-neutral-800"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company-name"
                      name="company-name"
                      placeholder="Ex: OpenAI"
                      className="w-full border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="job-title"
                      className="text-base font-medium text-neutral-800"
                    >
                      Job Title
                    </label>
                    <input
                      type="text"
                      id="job-title"
                      name="job-title"
                      placeholder="Ex: Software Engineer"
                      className="w-full border border-neutral-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label
                      htmlFor="job-description"
                      className="text-base font-medium text-neutral-800"
                    >
                      Job Description
                    </label>
                    <textarea
                      id="job-description"
                      name="job-description"
                      rows={5}
                      placeholder="Paste the job description here"
                      className="w-full border border-neutral-300 rounded-lg text-base resize-none focus:outline-none focus:ring-2 focus:ring-neutral-500"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="text-base font-medium text-neutral-800 !mb-2">
                      Your Resume (PDF)
                    </label>
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      fileUploadError={fileUploadError}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm leading-snug mb-3">
                    All resume data, AI feedback, reviews, and ATS scores stay
                    on your device and are never sent to or saved on our
                    servers.
                  </div>

                  <button
                    type="submit"
                    className="group cursor-pointer relative w-full overflow-hidden rounded-[8px] border border-transparent bg-neutral-950 text-white"
                  >
                    <span className="relative inline-flex py-3">
                      {/* Animated text spans */}
                      {Array.from("Review my Resume").map((char, i) => (
                        <span
                          key={i}
                          style={{ transitionDelay: `${i * 0.02}s` }}
                          className="duration-700 group-hover:rotate-x-360"
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
