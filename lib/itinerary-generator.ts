import { TravelItinerary } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

const instruction = `Follow this structure **exactly**:
{
  "destination": "Destination Name",
  "type": "Type of destination (e.g., trek, market, beach, etc.)",
  "days": Number of days in itinerary,
  "totalPlaces": Total number of places included in the itinerary,
  "travelInfo": {
    "distance": "Approximate distance between origin and destination",
    "travelTime": "Estimated travel time",
    "transportationOptions": [
      {
        "mode": "Transportation mode (e.g., flight, train, bus, car)",
        "duration": "Duration of travel",
        "cost": "Approximate cost",
        "description": "Brief description of the journey"
      }
    ]
  },
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

export async function generateItineraryUsingGemini(
  fromLocation: string,
  toLocation: string,
  days: number = 3
): Promise<TravelItinerary | undefined> {
  const prompt = `
    Generate a detailed ${days}-day travel itinerary from ${fromLocation} to ${toLocation}.
    
    Travel Information:
    - Calculate the approximate distance between ${fromLocation} and ${toLocation}
    - List all possible transportation options (flight, train, bus, car) with:
      * Duration of travel
      * Approximate costs
      * Brief description of the journey
      * Best recommended option based on time and budget
    
    Itinerary Details:
    - Suggest 3 hotels (budget, mid-range, luxury) with names and locations
    - Recommend cafes with their specialties and addresses
    - List must-visit attractions and hidden gems
    - Include a full daily schedule (breakfast, activities, lunch, evening)
    - Suggest local dishes to try
    - Provide estimated travel times between locations within the destination
    
    Additional Information:
    - Include any visa requirements if international travel
    - Mention any seasonal considerations
    - Note any cultural or local customs to be aware of
    - Include emergency contact numbers if relevant
  `;

  try {
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }], role: "model" }],
      generationConfig,
    });

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
