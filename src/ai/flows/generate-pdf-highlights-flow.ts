'use server';
/**
 * @fileOverview A Genkit flow that summarizes the key highlights of a PDF document.
 *
 * - generatePdfHighlights - A function to generate key highlights from a PDF.
 * - GeneratePdfHighlightsInput - The input type for the generatePdfHighlights function.
 * - GeneratePdfHighlightsOutput - The return type for the generatePdfHighlights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePdfHighlightsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "The PDF document content as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePdfHighlightsInput = z.infer<typeof GeneratePdfHighlightsInputSchema>;

const GeneratePdfHighlightsOutputSchema = z.object({
  highlights: z.string().describe("A concise summary of the PDF's key highlights."),
});
export type GeneratePdfHighlightsOutput = z.infer<typeof GeneratePdfHighlightsOutputSchema>;

export async function generatePdfHighlights(input: GeneratePdfHighlightsInput): Promise<GeneratePdfHighlightsOutput> {
  return generatePdfHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePdfHighlightsPrompt',
  input: {schema: GeneratePdfHighlightsInputSchema},
  output: {schema: GeneratePdfHighlightsOutputSchema},
  prompt: `You are an expert summarizer. Your task is to analyze the provided PDF document and extract its key highlights and main points.
Present the highlights as a concise summary, suitable for a quick preview.

PDF Document: {{media url=pdfDataUri}}`,
});

const generatePdfHighlightsFlow = ai.defineFlow(
  {
    name: 'generatePdfHighlightsFlow',
    inputSchema: GeneratePdfHighlightsInputSchema,
    outputSchema: GeneratePdfHighlightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
