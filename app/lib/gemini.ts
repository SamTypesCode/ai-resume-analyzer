import { GoogleGenerativeAI } from "@google/generative-ai";

// Load the GOOGLE_GEMINI_API_KEY from environment variables
const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY!;

const gemini = new GoogleGenerativeAI(API_KEY);

export async function analyzeWithGemini(imageFile: File, prompt: string) {
  // Specify the model to use
  const model = gemini.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  // Prepare the image so it could be sent to the AI model
  const imageBytes = await imageFile.arrayBuffer();
  const base64Image = btoa(
    new Uint8Array(imageBytes).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  // Send the prompt and image to the model and get the reponse back
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: imageFile.type,
        data: base64Image,
      },
    },
    prompt,
  ]);

  // Return the AI response back
  const response = result.response;
  return response.text();
}
