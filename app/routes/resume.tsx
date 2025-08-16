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
  const { id } = useParams();

  const [resume, setResume] = useState<Resume | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let pdfObjectUrl: string;
    let imageObjectUrl: string;

    getResume(id).then((data) => {
      if (data) {
        pdfObjectUrl = URL.createObjectURL(data.pdfBlob);
        imageObjectUrl = URL.createObjectURL(data.imageBlob);

        setPdfUrl(pdfObjectUrl);
        setImageUrl(imageObjectUrl);
        setResume(data);
      }
    });

    return () => {
      if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
      if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    };
  }, [id]);

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
      <div className="flex-1 w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row lg:items-start pt-4 lg:pt-12 lg:pb-[calc(3rem+env(safe-area-inset-bottom))] pb-[calc(1rem+env(safe-area-inset-bottom))] gap-6">
        {/* Only render content if data is loaded */}
        {imageUrl && pdfUrl && resume?.feedback ? (
          <>
            {/* Left column: Summary & Details */}
            <section className="lg:w-[360px] w-full p-6 rounded-3xl border border-neutral-200 flex flex-col gap-6">
              <Summary score={resume.feedback.ATS.score} />
              <Details feedback={resume.feedback} />
            </section>

            {/* Right column: Resume preview image linking to PDF */}
            <section className="flex-1 w-full flex items-center justify-center lg:pl-6">
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full rounded-3xl border border-neutral-200"
                  alt="resume preview"
                />
              </a>
            </section>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-500 text-lg">
            Loading resume...
          </div>
        )}
      </div>
    </main>
  );
}
