// The JSON format in which the AI should reply, a response in the form of JSON makes it easy to parse the response and perform actions or map over the data to create UI
export const AIResponseFormat = `
      interface Feedback {
      ATS: {
        score: number; //a kind of overall score, based on ATS suitability, max 100
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

// A simple prompt that tells the AI to act like an ATS and resume analysis expert and generate a detailed review and ATS score
export const prepareInstructions = ({
  companyName,
  jobTitle,
  jobDescription,
}: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
}) =>
  `You are an expert in ATS (Applicant Tracking Systems) and resume analysis.

Your task is to evaluate and score this resume as if you were an ATS and recruiter. Be honest and critical — if the resume is weak or poorly aligned with the job, give a low score.

The following fields are user inputs and may vary:
- Company Name: ${companyName}
- Job Title: ${jobTitle}
- Job Description: ${jobDescription}

Use the job title and job description to assess the resume’s relevance and keyword alignment. If the job description is missing or vague, base your feedback on general expectations for the given role.

---
Important Output Instructions:
- Always return a valid JSON object.
- Do not include markdown, backticks, or any extra explanation outside the JSON.
- Follow the exact structure and property names in ${AIResponseFormat}.
- Titles: max 3–4 words, single short line.
- Descriptions: max 1 short line, under ~25 chars.
- Keep everything extremely brief, with no filler words.
- Never break the format, even if inputs are incomplete, missing, or irrelevant.
- Make all scores and text as short and clear as possible.

Return only the final result as a structured JSON object.
`;
