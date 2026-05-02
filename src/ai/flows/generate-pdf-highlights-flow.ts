
'use server';
/**
 * @fileOverview Un flujo de Genkit que resume los puntos clave de un documento PDF en español.
 *
 * - generatePdfHighlights - Una función para generar puntos clave desde un PDF.
 * - GeneratePdfHighlightsInput - El tipo de entrada para la función.
 * - GeneratePdfHighlightsOutput - El tipo de salida para la función.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePdfHighlightsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "El contenido del documento PDF como un data URI codificado en Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GeneratePdfHighlightsInput = z.infer<typeof GeneratePdfHighlightsInputSchema>;

const GeneratePdfHighlightsOutputSchema = z.object({
  highlights: z.string().describe("Un resumen conciso de los puntos clave del PDF en español."),
});
export type GeneratePdfHighlightsOutput = z.infer<typeof GeneratePdfHighlightsOutputSchema>;

export async function generatePdfHighlights(input: GeneratePdfHighlightsInput): Promise<GeneratePdfHighlightsOutput> {
  return generatePdfHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePdfHighlightsPrompt',
  input: {schema: GeneratePdfHighlightsInputSchema},
  output: {schema: GeneratePdfHighlightsOutputSchema},
  prompt: `Eres un experto en síntesis editorial. Tu tarea es analizar el documento PDF proporcionado y extraer sus puntos más importantes.
Presenta los puntos clave como un resumen conciso y elegante, SIEMPRE en idioma ESPAÑOL.

Documento PDF: {{media url=pdfDataUri}}`,
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
