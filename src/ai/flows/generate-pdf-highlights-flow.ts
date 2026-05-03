
'use server';
/**
 * @fileOverview Un flujo de Genkit especializado en síntesis editorial de cartas personales.
 *
 * - generatePdfHighlights - Extrae la esencia emocional y puntos clave de un PDF.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePdfHighlightsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "El contenido del documento PDF como un data URI codificado en Base64."
    ),
});
export type GeneratePdfHighlightsInput = z.infer<typeof GeneratePdfHighlightsInputSchema>;

const GeneratePdfHighlightsOutputSchema = z.object({
  highlights: z.string().describe("Un resumen poético y editorial de la carta, SIEMPRE en español."),
});
export type GeneratePdfHighlightsOutput = z.infer<typeof GeneratePdfHighlightsOutputSchema>;

export async function generatePdfHighlights(input: GeneratePdfHighlightsInput): Promise<GeneratePdfHighlightsOutput> {
  return generatePdfHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePdfHighlightsPrompt',
  input: {schema: GeneratePdfHighlightsInputSchema},
  output: {schema: GeneratePdfHighlightsOutputSchema},
  prompt: `Eres un curador editorial y experto en análisis de correspondencia romántica y personal. 
Tu tarea es leer el documento PDF proporcionado y extraer su "esencia emocional".

REGLAS CRUCIALES:
1. El tono debe ser elegante, poético y respetuoso (estilo editorial de lujo).
2. Debes sintetizar los sentimientos, promesas o momentos clave mencionados.
3. El resultado debe ser un párrafo fluido, sin listas, que capture el corazón del mensaje.
4. SIEMPRE responde en ESPAÑOL.
5. Si el documento es muy corto, expande un poco la interpretación poética de lo escrito.

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
