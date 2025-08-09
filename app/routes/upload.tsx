import { Link } from "react-router";
import type { Route } from "./+types/home";
import { useState } from "react";

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

  return (
    <main className="flex flex-col min-h-screen bg-white !pt-0">
      {/* A simple bar at the top with a button for going back to the home page */}
      <nav className="flex flex-row sticky top-0 bg-white/70 backdrop-blur-lg justify-between items-center p-4 border-b border-gray-200 z-10">
        <Link
          to="/"
          className="flex flex-row items-center gap-2 border border-gray-200 rounded-lg p-2 shadow-sm bg-white"
        >
          <span className="text-gray-800 text-sm font-semibold">
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
                <p className="text-5xl md:text-6xl leading-tight tracking-[-2px] font-semibold text-gray-900">
                  Get smart AI feedback for your dream job
                </p>
                <h2 className="mt-4 !text-gray-600">
                  Upload your resume and get an ATS score, detailed suggestions,
                  and improvement tips.
                </h2>
              </div>
            </section>
            <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center pb-12">
              <form
                id="upload-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Add function to handle form submission
                  // handleSubmit(e);
                }}
                className="w-full space-y-0-2"
              >
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="company-name"
                    className="text-base font-medium text-gray-800 mb-1"
                  >
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company-name"
                    name="company-name"
                    placeholder="Ex: OpenAI"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="job-title"
                    className="text-base font-medium text-gray-800 mb-1"
                  >
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="job-title"
                    name="job-title"
                    placeholder="Ex: Software Engineer"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label
                    htmlFor="job-description"
                    className="text-base font-medium text-gray-800 mb-1"
                  >
                    Job Description
                  </label>
                  <textarea
                    id="job-description"
                    name="job-description"
                    rows={5}
                    placeholder="Paste the job description here"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col w-full space-y-2">
                  <label
                    htmlFor="resume"
                    className="text-base font-medium text-gray-800"
                  >
                    Your Resume (PDF)
                  </label>
                  {/* TODO: Add working FileUploader component */}
                  {/* <FileUploader onFileSelect={handleFileSelect} /> */}
                </div>

                <button
                  type="submit"
                  className="w-full cursor-pointer bg-gray-900 text-white text-lg font-semibold py-3 rounded-lg shadow hover:bg-gray-800 transition"
                >
                  Submit
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
