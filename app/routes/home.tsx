import type { Route } from "./+types/home";

// Define the meta deta such as page title and description for SEO
export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Resume Analyzer" },
    {
      name: "description",
      content:
        "A client‑side web app that takes a resume and a target job, then uses AI to generate an ATS score, actionable improvement tips, and never stores any data on the server.",
    },
  ];
}

// Return the default home page component
export default function Home() {
  return <></>;
}
