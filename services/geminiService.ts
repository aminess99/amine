import { GoogleGenAI, Type } from "@google/genai";
import { Book, GenerateBookParams } from "../types";

// Initialize the client
// Using process.env.API_KEY as strictly required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBookContent = async (params: GenerateBookParams): Promise<Book> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are a professional book author. Write a book in Arabic based on the following specifications:
    
    Main Topic/Title Idea: "${params.topic}"
    Specific Details/User Vision: "${params.details}"
    Target Audience: ${params.audience}
    Tone/Style: ${params.languageStyle}
    Length Constraint: The book MUST have exactly ${params.chapterCount} chapters.
    Note: The user expects a book length equivalent to roughly ${params.chapterCount * 2} standard pages. Ensure each chapter is long enough to fill about 2 pages of text.
    
    The book should have:
    1. A creative title in Arabic.
    2. An author name (invent one fitting the style or use 'AI Author').
    3. A short, engaging back-cover description.
    4. Exactly ${params.chapterCount} detailed chapters. 
    
    IMPORTANT: 
    - If specific details are provided in "Specific Details", YOU MUST incorporate them into the story or content.
    - Each chapter must be substantial (approx 400-600 words per chapter) to satisfy the page count requirement. 
    - Format with proper paragraphs.
    
    Return the response strictly in valid JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "The title of the book in Arabic" },
            author: { type: Type.STRING, description: "The name of the author" },
            description: { type: Type.STRING, description: "A short summary of the book back cover" },
            chapters: {
              type: Type.ARRAY,
              description: `List of exactly ${params.chapterCount} chapters`,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Chapter title" },
                  content: { type: Type.STRING, description: "Full text content of the chapter, rich and detailed" }
                },
                required: ["title", "content"]
              }
            }
          },
          required: ["title", "author", "description", "chapters"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No content generated from Gemini.");
    }

    const bookData = JSON.parse(text) as Book;
    return bookData;

  } catch (error) {
    console.error("Error generating book:", error);
    throw error;
  }
};