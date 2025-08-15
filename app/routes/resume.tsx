import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { Link, useParams } from "react-router";
import { getResume } from "~/lib/db";
import Summary from "~/components/Summary";
import Details from "~/components/Details";

// Define the meta deta such as page title and description for SEO
export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Review & Feedback" },
    {
      name: "description",
      content:
        "View your AI-generated resume review with detailed feedback and improvement tips. Gain insights on formatting, keywords, and relevance to help you land your next job.",
    },
  ];
}

// Return the default resume page component
export default function Resume() {
  // Resume ID from URL
  const { id } = useParams();
  // State to store the resume object containing the feedback
  const [resume, setResume] = useState<Resume | null>(null);
  // State to store the PDF URL created in the browser
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // State to store the image URL created in the browser
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Use the ID from the URL to get the resume, the image and the PDF from the local database using idb-keyval
  useEffect(() => {
    if (!id) return;

    let pdfObjectUrl: string;
    let imageObjectUrl: string;

    // Get the resume from the local database and create a URL for the image and the PDF
    getResume(id).then((data) => {
      if (data) {
        pdfObjectUrl = URL.createObjectURL(data.pdfBlob);
        imageObjectUrl = URL.createObjectURL(data.imageBlob);

        setPdfUrl(pdfObjectUrl);
        setImageUrl(imageObjectUrl);
        setResume(data);
      }
    });

    // Delete the created URLs for the image and the PDF on component or page unmount
    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [id]);

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

      <div className="flex-1 h-full flex max-lg:flex-col">
        {/* If the resume data is found then display the review UI */}
        {imageUrl && pdfUrl && resume?.feedback ? (
          <>
            <section className="lg:max-w-[324px] w-full p-6 lg:h-[calc(100vh-71px)] lg:overflow-y-auto">
              <Summary score={resume.feedback.ATS.score} />
              <Details />
            </section>
            {/* TODO: Add section to display the PDF image */}
          </>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
