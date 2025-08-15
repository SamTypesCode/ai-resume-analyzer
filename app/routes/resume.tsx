import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { Link, useParams } from "react-router";
import { getResume } from "~/lib/db";
import Summary from "~/components/Summary";
import Details from "~/components/Details";

// Meta information for the page (SEO)
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

// Resume page component
export default function Resume() {
  // Get the resume ID from the URL
  const { id } = useParams();

  // State to hold resume data (with feedback)
  const [resume, setResume] = useState<Resume | null>(null);
  // State to hold PDF blob URL
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // State to hold image blob URL
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Fetch resume from local IndexedDB storage by ID
  useEffect(() => {
    if (!id) return;

    let pdfObjectUrl: string;
    let imageObjectUrl: string;

    // Retrieve resume data and create blob URLs for PDF & image
    getResume(id).then((data) => {
      if (data) {
        pdfObjectUrl = URL.createObjectURL(data.pdfBlob);
        imageObjectUrl = URL.createObjectURL(data.imageBlob);

        setPdfUrl(pdfObjectUrl);
        setImageUrl(imageObjectUrl);
        setResume(data);
      }
    });

    // Cleanup blob URLs on component unmount
    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [id]);

  return (
    <main className="flex flex-col min-h-[100dvh] bg-white !pt-0">
      {/* Top navigation bar with "Back to Homepage" link */}
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

      {/* Main content area - keeps items at top instead of stretching */}
      <div className="flex-1 w-full max-w-screen-xl mx-auto h-full flex items-start max-lg:flex-col max-lg:pb-4 lg:pt-12 pb-12 pt-4 px-4">
        {/* Only render content if data is loaded */}
        {imageUrl && pdfUrl && resume?.feedback ? (
          <>
            {/* Left column: Summary & Details */}
            <section className="lg:max-w-[360px] w-full p-6 rounded-3xl border border-neutral-200">
              <Summary score={resume.feedback.ATS.score} />
              <Details feedback={resume.feedback} />
            </section>

            {/* Right column: Resume preview image linking to PDF */}
            <section className="flex-1 w-full flex items-center justify-center max-lg:pt-4 lg:pl-8">
              <a href={pdfUrl} target="_blank">
                <img
                  src={imageUrl}
                  className="w-full rounded-3xl border border-neutral-200"
                  alt="resume image"
                />
              </a>
            </section>
          </>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
