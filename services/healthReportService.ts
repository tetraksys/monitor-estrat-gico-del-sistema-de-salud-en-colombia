
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// IMPORTANT: This file contains server-side logic and should NOT be executed
// in the browser. It accesses an API key via environment variables and makes
// a direct call to the Google GenAI API. This function should be deployed
// as a serverless function or on a secure backend server.

// ¡CORREGIDO! Así es como se accede a las variables de entorno con Vite
if (!import.meta.env.VITE_API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

/**
 * Generates a weekly strategic monitoring report about the Colombian healthcare system.
 * This function is designed to run on a server, not in the client/browser.
 * It calls the Gemini API with Google Search enabled.
 * 
 * @returns {Promise<string>} A promise that resolves to a JSON string representation 
 * of the full GenerateContentResponse from the API.
 */
export async function generateHealthReport(): Promise<string> {
  const today = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
    Act as a strategic intelligence analyst for a multinational pharmaceutical company in Colombia.
    Your task is to generate a weekly monitoring report, dated today (${today}), about the Colombian healthcare system.
    Use public and recent information from open sources such as news articles, social media (X/Twitter), YouTube, official bulletins, and institutional press releases.

    Focus on the following key areas:
    1. **Financial Flows and Sustainability:** Analyze news about payments to health insurers (EPS), logistics operators, labs, health budgets, the UPC, “Presupuestos Máximos”, and any fiscal alerts or financing risks.
    2. **Drug Price Regulation:** Report on implementation or changes in pricing regulations or circulars and any public statements from MinSalud, Supersalud, or Superindustria.
    3. **Access to New Therapies and Innovation:** Capture debates on precision medicine, orphan drugs, intellectual property, and any legislation or presidential remarks impacting access to innovative treatments.

    Pay special attention to statements from the President of Colombia or senior officials (MinSalud, MinHacienda, Supersalud, ADRES). Flag any narrative or policy shifts from these actors as 'isHighPriority: true'.

    Your final response MUST be a valid JSON object only — no markdown or explanatory text. Structure it as follows:

    {
      "executiveSummary": "string",
      "criticalAlerts": ["string"],
      "financialSustainability": [findingObject, ...],
      "pricingRegulation": [findingObject, ...],
      "newTherapiesAccess": [findingObject, ...]
    }

    Each 'findingObject' should be:
    {
      "title": "string", "summary": "string", "source": "string", "sourceUrl": "string",
      "sentiment": "Positivo" | "Negativo" | "Neutral", "pharmaImpact": "string",
      "keyActor": "string", "isHighPriority": boolean
    }
    The entire content must be in Spanish.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  // Return the full response object as a string. The client will parse this
  // to access both the text and the grounding metadata for sources.
  return JSON.stringify(response);
}
