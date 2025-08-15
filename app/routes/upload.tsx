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

      // Convert the first page of the PDF into an image so it can be sent to the AI
      setStatusText("Converting PDF to image");
      await delay(1000);
      let imageFile;
      try {
        imageFile = await convertPdfToImage(file);
        if (!imageFile.file) {
          setStatusText("Failed to convert PDF to image");
          return;
        }
      } catch (err) {
        console.error("Error converting PDF:", err);
        setStatusText("Failed to convert PDF to image");
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
        return;
      }

      // Prepare AI prompt
      setStatusText("Preparing instructions");
      await delay(1000);
      let prompt;
      try {
        prompt = prepareInstructions({
          companyName,
          jobTitle,
          jobDescription,
        });
        if (!prompt) {
          setStatusText("Failed to prepare instructions");
          return;
        }
      } catch (err) {
        console.error("Error preparing instructions:", err);
        setStatusText("Failed to prepare instructions");
        return;
      }

      // Send data to AI
      setStatusText("Analyzing");
      let geminiResponse;
      try {
        geminiResponse = await analyzeWithGemini(imageFile.file, prompt);
        if (!geminiResponse) {
          setStatusText("Failed to analyze resume");
          return;
        }
      } catch (err) {
        console.error("Error analyzing with Gemini:", err);
        setStatusText("Failed to analyze resume");
        return;
      }

      // Turn the AI's response into a JSON object so the values inside can be accesed and the data can be mapped over
      setStatusText("Parsing AI response");
      await delay(1000);
      try {
        // Remove triple backticks (``` or ```json)
        const cleaned = geminiResponse
          .replace(/^```(?:json)?/, "")
          .replace(/```$/, "")
          .trim();
        // Parse the response into JSON
        resume.feedback = JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse Gemini response:", err);
        return setStatusText("Failed to parse AI response");
      }

      // Save the AI's response, the PDF file and the image in the local IndexedDB using idb-keyval
      setStatusText("Saving");
      await delay(1000);
      const saveResult = await saveResume(resume, file, imageFile.file);
      if (!saveResult.success) {
        setStatusText("Failed to save resume: " + saveResult.error);
        return;
      }

      // Redirect to the resume review page
      setStatusText("Redirecting");
      await delay(1000);
      navigate(`/resume/${uuid}`);
    } catch (err) {
      console.error("Unexpected error in processData:", err);
      setStatusText("Something went wrong");
    } finally {
      // This ensures the processing flag is reset even if something fails
      setIsProcessing(false);
    }
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
    if (!file) {
      // If the device has vibration hardware like one in a mobile phone then vibrate the phone
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      } else {
        console.log("Vibration not supported on this device.");
      }
      // Make the file uploader component red
      setFileUploadError(true);
      return;
    }

    setFileUploadError(false);
    // Process the user input data
    processData({ companyName, jobTitle, jobDescription, file });
  };

  // File select function to be passed to the file uploader component
  const handleFileSelect = (file: File | null) => {
    setFileUploadError(false);
    setFile(file);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white !pt-0">
      {/* A simple bar at the top with a button for going back to the home page */}
      <nav className="flex flex-row sticky top-0 bg-white/90 backdrop-blur-lg justify-between items-center p-4 border-b border-neutral-200 z-50">
        <Link
          to="/"
          className="flex flex-row items-center gap-2 border border-neutral-200 rounded-lg p-2 shadow-sm bg-white"
        >
          <span className="text-neutral-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex-1 h-full flex flex-col px-4">
        {isProcessing ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Spinner animation for loading */}
            <div className="w-10 h-10 border-4 border-neutral-300 border-t-neutral-800 rounded-full animate-spin"></div>

            {/* Status text to tell the user what's currently being done */}
            <p className="mt-4 text-neutral-600 text-lg tracking-wide">
              {statusText}
            </p>
          </div>
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
                  <FileUploader
                    onFileSelect={handleFileSelect}
                    fileUploadError={fileUploadError}
                  />
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
