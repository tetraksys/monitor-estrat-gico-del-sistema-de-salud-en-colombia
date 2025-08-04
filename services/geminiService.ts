
import { generateHealthReport } from './healthReportService';
import { ReportData, GroundingSource } from '../types';
import type { GenerateContentResponse } from '@google/genai';

/**
 * A more robust way to extract text from a Gemini response.
 * It first tries the simple .text accessor, and if that fails,
 * it attempts to construct the text from the response candidate's parts.
 * @param response The GenerateContentResponse from the API.
 * @returns The extracted text content as a string.
 */
const getTextFromResponse = (response: GenerateContentResponse): string => {
    if (response.text) {
        return response.text;
    }
    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
        return candidate.content.parts.map(part => part.text).filter(Boolean).join('');
    }
    return '';
};

// This service now acts as a wrapper that calls the server-side function,
// then handles response parsing, source extraction, and UI-specific error formatting.
export const generateReport = async (): Promise<{ reportData: ReportData | null, sources: GroundingSource[] }> => {
    try {
        // This function is expected to be executed on a server, which then returns a string.
        const responseString = await generateHealthReport();
        const response: GenerateContentResponse = JSON.parse(responseString);

        // 1. Check for explicit blocks from the API
        if (response.promptFeedback?.blockReason) {
            throw new Error(`La solicitud fue bloqueada por la API por: ${response.promptFeedback.blockReason}.`);
        }

        const candidate = response.candidates?.[0];
        if (!candidate) {
            throw new Error("La respuesta de la IA no contiene un candidato válido. La respuesta pudo haber sido bloqueada por seguridad.");
        }
        
        const rawText = getTextFromResponse(response);
        
        let reportData: ReportData | null = null;
        if (rawText) {
            // The model might return the JSON inside a markdown block.
            // We extract it and then parse.
            const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
            const match = rawText.match(jsonRegex);
            const jsonString = match ? match[1].trim() : rawText.trim();

            try {
                reportData = JSON.parse(jsonString);
            } catch (e) {
                console.error("Failed to parse JSON response from Gemini:", e);
                console.error("Raw response text:", rawText);
                throw new Error("La respuesta de la IA no tenía un formato JSON válido.");
            }
        } else {
             // If text is still empty, provide a more detailed error.
             const finishReason = candidate.finishReason;
             const finishReasonInfo = finishReason ? ` (Razón de finalización: ${finishReason})` : '';
             if (finishReason === 'SAFETY') {
                 throw new Error('La respuesta fue bloqueada por filtros de seguridad.');
             }
             throw new Error(`La respuesta de la IA estaba vacía.${finishReasonInfo}`);
        }

        const groundingMetadata = candidate.groundingMetadata;
        const sources: GroundingSource[] = groundingMetadata?.groundingChunks
            ?.map((chunk: any) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || 'Fuente sin título'
            }))
            .filter((source: GroundingSource) => source.uri) || [];
        
        // Deduplicate sources
        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

        return { reportData, sources: uniqueSources };

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        
        let errorMessage = "Ocurrió un error inesperado al generar el informe.";

        // Best-effort to get a string representation of the error
        let errorDetails = '';
        if (error instanceof Error) {
            errorDetails = error.message;
        } else {
            try {
                errorDetails = JSON.stringify(error);
            } catch {
                errorDetails = String(error);
            }
        }

        if (errorDetails.includes("Proxying failed") || errorDetails.includes("Failed to fetch")) {
            errorMessage = "No se pudo conectar con el servicio de IA debido a un problema de red. Por favor, verifique su conexión a internet e inténtelo de nuevo.";
        } else if (
            errorDetails.includes("La respuesta de la IA no tenía un formato JSON válido.") ||
            errorDetails.includes("La respuesta de la IA estaba vacía.") ||
            errorDetails.includes("bloqueada")
        ) {
            // Pass our specific, user-friendly errors through to the UI
            errorMessage = errorDetails;
        } else {
            // For other errors, we provide a generic message but avoid showing technical details.
            errorMessage = "No se pudo conectar con el servicio de IA. Inténtelo de nuevo más tarde.";
        }
        
        throw new Error(errorMessage);
    }
};
