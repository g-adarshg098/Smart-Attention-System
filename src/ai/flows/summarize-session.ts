'use server';

/**
 * @fileOverview Summarizes a study session, highlighting periods of high and low attention.
 *
 * - summarizeSession - A function that summarizes the study session.
 * - SummarizeSessionInput - The input type for the summarizeSession function.
 * - SummarizeSessionOutput - The return type for the summarizeSession function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSessionInputSchema = z.object({
  attentionData: z.array(
    z.object({
      timestamp: z.string().describe('The timestamp of the attention data point.'),
      attentionLevel: z
        .number()
        .describe('The attention level at the given timestamp (0-100).'),
    })
  ).describe('An array of attention data points with timestamps and attention levels.'),
  studySessionDetails: z
    .string()
    .optional()
    .describe('Any relevant details about the study session, e.g., topic.'),
});
export type SummarizeSessionInput = z.infer<typeof SummarizeSessionInputSchema>;

const SummarizeSessionOutputSchema = z.object({
  summary: z.string().describe('A summary of the study session, highlighting periods of high and low attention.'),
});
export type SummarizeSessionOutput = z.infer<typeof SummarizeSessionOutputSchema>;

export async function summarizeSession(input: SummarizeSessionInput): Promise<SummarizeSessionOutput> {
  return summarizeSessionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSessionPrompt',
  input: {schema: SummarizeSessionInputSchema},
  output: {schema: SummarizeSessionOutputSchema},
  prompt: `You are an AI assistant that summarizes study sessions based on attention data.

  The user wants a summary of their study session, highlighting periods of high and low attention, so they can identify patterns and improve their focus.

  Here are the details of the study session:
  {{#if studySessionDetails}}
  Study Session Details: {{{studySessionDetails}}}
  {{/if}}

  Attention Data:
  {{#each attentionData}}
  - Timestamp: {{{timestamp}}}, Attention Level: {{{attentionLevel}}}
  {{/each}}

  Please provide a concise summary of the session, focusing on the key trends in attention levels and any significant periods of high or low focus.
`,
});

const summarizeSessionFlow = ai.defineFlow(
  {
    name: 'summarizeSessionFlow',
    inputSchema: SummarizeSessionInputSchema,
    outputSchema: SummarizeSessionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
