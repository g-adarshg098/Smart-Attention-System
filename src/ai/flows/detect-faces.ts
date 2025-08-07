'use server';

/**
 * @fileOverview Detects faces in an image and estimates their attention.
 *
 * - detectFaces - A function that detects faces and analyzes their attention.
 * - DetectFacesInput - The input type for the detectFaces function.
 * - DetectFacesOutput - The return type for the detectFaces function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaceSchema = z.object({
  attentionLevel: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'An estimation of the attention level of the person (0-100), where 100 is fully focused.'
    ),
});

const DetectFacesInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo from the webcam, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectFacesInput = z.infer<typeof DetectFacesInputSchema>;

const DetectFacesOutputSchema = z.object({
  faces: z.array(FaceSchema).describe('An array of detected faces.'),
});
export type DetectFacesOutput = z.infer<typeof DetectFacesOutputSchema>;

export async function detectFaces(
  input: DetectFacesInput
): Promise<DetectFacesOutput> {
  return detectFacesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectFacesPrompt',
  input: {schema: DetectFacesInputSchema},
  output: {schema: DetectFacesOutputSchema},
  prompt: `You are an expert in computer vision and psychology. Your task is to analyze an image from a webcam feed and detect human faces.

For each face you detect, you must estimate the person's attention level on a scale from 0 to 100.
- 100 means the person is fully focused and looking directly at the screen.
- 50 means the person is attentive but might be slightly looking away.
- 0 means the person is not paying attention, is looking away, or is not present.

If no face is detected, return an empty array for the 'faces' field.

Analyze the following image:
{{media url=imageDataUri}}`,
});

const detectFacesFlow = ai.defineFlow(
  {
    name: 'detectFacesFlow',
    inputSchema: DetectFacesInputSchema,
    outputSchema: DetectFacesOutputSchema,
  },
  async input => {
    // If the image data is empty, return no faces.
    if (!input.imageDataUri.split(',')[1]) {
      return { faces: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
