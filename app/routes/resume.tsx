import { useEffect, useState } from "react";
import type { Route } from "./+types/home";
import { useParams } from "react-router";
import { getResume } from "~/lib/db";

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

  return <></>;
}
