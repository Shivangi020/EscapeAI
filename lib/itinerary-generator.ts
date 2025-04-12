import { TravelItinerary } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI("");

const instruction = `Follow this structure **exactly**:
{
  "destination": "Destination Name",
  "type": "Type of destination (e.g., trek, market, beach, etc.)",
  "days": Number of days in itinerary,
  "totalPlaces": Total number of places included in the itinerary,
  "itinerary": [
    {
      "day": 1,
      "attractions": [
        { 
          "name": "Attraction Name", 
          "description": "Short description", 
          "address": "Location" 
        }
      ],
      "schedule": [
        { 
          "time": "08:00 AM", 
          "activity": "Breakfast at Cafe Name",
          "typeOfActivity": **MUST** be one of the following categories:
          [
          "food",
          "museum",
          "mountain",
          "shopping",
          "beach",
          "park",
          "historical site",
          "religious site",
          "adventure",
          "cultural experience",
          "nightlife",
          "wellness",
          "nature",
          "art gallery",
          "sports",
          "transportation",
          "local market",
          "theme park",
          "workshop/class",
          "scenic viewpoint",
          "urban exploration"
],
          "attractionName": "Attraction or place name"
        },
        { 
          "time": "10:00 AM", 
          "activity": "Visit Attraction Name",
          "typeOfActivity": **MUST** be one of the above categories,
          "attractionName": "Attraction or place name"
        }
      ]
    }
  ]
}

Return only **valid JSON**. **Do NOT include explanations, additional text, or markdown formatting.**`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  systemInstruction: instruction,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

type Itinerary = Record<string, any>; // You can define a stricter interface based on expected structure

type GeminiContentPart = { text: string };
type GeminiCandidate = { content: { parts: GeminiContentPart[] } };
type GeminiResponse = {
  response: {
    candidates: GeminiCandidate[];
  };
};

export async function generateItineraryUsingGemini(
  destination: string,
  days: number = 3
): Promise<TravelItinerary | undefined> {
  console.log(apiKey);
  const prompt = `
    Generate a **detailed ${days}-day travel itinerary for ${destination}**.
    - Suggest **3 hotels (budget, mid-range, luxury)** with names and locations.
    - Recommend **cafes with their specialties and addresses**.
    - List **must-visit attractions and hidden gems**.
    - Include **a full daily schedule** (breakfast, activities, lunch, evening).
    - Suggest **local dishes to try**.
    - Provide estimated **travel times** between locations.
  `;

  try {
    const result = (await model.generateContent({
      contents: [{ parts: [{ text: prompt }], role: "model" }],
      generationConfig,
    })) as GeminiResponse;

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned from Gemini model.");
    }

    const jsonData: TravelItinerary = JSON.parse(text);
    return jsonData;
  } catch (error) {
    console.error("Failed to generate or parse itinerary:", error);
    return undefined;
  }
}
