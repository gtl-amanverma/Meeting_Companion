// tailor-interview-answers.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for tailoring answers to interview questions.
 *
 * - tailorInterviewAnswer - A function that tailors interview answers based on the question and user profile.
 * - TailorInterviewAnswerInput - The input type for the tailorInterviewAnswer function.
 * - TailorInterviewAnswerOutput - The return type for the tailorInterviewAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailorInterviewAnswerInputSchema = z.object({
  question: z.string().describe('The interview question asked.'),
  userProfile: z.string().optional().describe('The user profile or resume content.'),
  predefinedAnswerBank: z.string().optional().describe('A bank of predefined answers to common questions'),
});
export type TailorInterviewAnswerInput = z.infer<typeof TailorInterviewAnswerInputSchema>;

const TailorInterviewAnswerOutputSchema = z.object({
  tailoredAnswer: z.string().describe('The tailored answer for the interview question.'),
});
export type TailorInterviewAnswerOutput = z.infer<typeof TailorInterviewAnswerOutputSchema>;

export async function tailorInterviewAnswer(input: TailorInterviewAnswerInput): Promise<TailorInterviewAnswerOutput> {
  return tailorInterviewAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tailorInterviewAnswerPrompt',
  input: {schema: TailorInterviewAnswerInputSchema},
  output: {schema: TailorInterviewAnswerOutputSchema},
  prompt: `You are an expert interview coach.

  Based on the interview question and the user's profile, generate a tailored and professional answer.

  Question: {{{question}}}
  User Profile: {{{userProfile}}}
  Predefined Answer Bank: {{{predefinedAnswerBank}}}

  Tailored Answer:`, // The triple curly braces prevent HTML escaping
});

const tailorInterviewAnswerFlow = ai.defineFlow(
  {
    name: 'tailorInterviewAnswerFlow',
    inputSchema: TailorInterviewAnswerInputSchema,
    outputSchema: TailorInterviewAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
