'use server';

/**
 * @fileOverview Implements the core logic for answering questions during a meeting.
 *
 * - answerMeetingQuestion - The main exported function to process meeting transcripts and generate answers.
 * - AnswerMeetingQuestionInput - The input type for the answerMeetingQuestion function.
 * - AnswerMeetingQuestionOutput - The return type for the answerMeetingQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerMeetingQuestionInputSchema = z.object({
  transcript: z.string().describe('The transcribed text of the meeting.'),
  userName: z.string().describe('The name of the user to identify questions directed to.'),
  answerBank: z.string().describe('A predefined bank of answers in JSON format.'),
  interviewMode: z.boolean().default(false).describe('Enable interview mode to tailor answers professionally.'),
  resumeData: z.string().optional().describe('Optional resume data to personalize answers in interview mode.'),
});

export type AnswerMeetingQuestionInput = z.infer<typeof AnswerMeetingQuestionInputSchema>;

const AnswerMeetingQuestionOutputSchema = z.object({
  answer: z.string().describe('The generated answer to the question.'),
  questionDetected: z.boolean().describe('Whether a question directed to the user was detected.'),
});

export type AnswerMeetingQuestionOutput = z.infer<typeof AnswerMeetingQuestionOutputSchema>;


export async function answerMeetingQuestion(input: AnswerMeetingQuestionInput): Promise<AnswerMeetingQuestionOutput> {
  return answerMeetingQuestionFlow(input);
}

const detectQuestionPrompt = ai.definePrompt({
  name: 'detectQuestionPrompt',
  input: {
    schema: z.object({
      transcript: z.string(),
      userName: z.string(),
    }),
  },
  output: {
    schema: z.object({
      isQuestionForUser: z.boolean().describe('Whether the transcript contains a question directed to the user.'),
      question: z.string().optional().describe('The question that was asked, if any.'),
    }),
  },
  prompt: `Determine if the following transcript contains a question directed to the user, {{{userName}}}.\n\nTranscript: {{{transcript}}}\n\nOutput JSON: {"isQuestionForUser": whether a question is directed at the user, "question": the exact question asked, if any.}`,
});

const selectAnswerPrompt = ai.definePrompt({
  name: 'selectAnswerPrompt',
  input: {
    schema: z.object({
      question: z.string(),
      answerBank: z.string(),
      interviewMode: z.boolean(),
      resumeData: z.string().optional(),
    }),
  },
  output: {
    schema: z.object({
      answer: z.string().describe('The best matching answer from the answer bank, or a generated answer.'),
    }),
  },
  prompt: `Given the question: {{{question}}}, and the following answer bank: {{{answerBank}}}, select the best answer. {{#if interviewMode}}Since interview mode is enabled, tailor the answer to be professional and impressive. If resume data is available: {{{resumeData}}}, use this to personalize the answer.{{/if}} Output only the answer.`,  
});

const answerMeetingQuestionFlow = ai.defineFlow({
  name: 'answerMeetingQuestionFlow',
  inputSchema: AnswerMeetingQuestionInputSchema,
  outputSchema: AnswerMeetingQuestionOutputSchema,
}, async (input) => {
  const {transcript, userName, answerBank, interviewMode, resumeData} = input;

  const {output: detectQuestionOutput} = await detectQuestionPrompt({
    transcript: transcript,
    userName: userName,
  });

  if (!detectQuestionOutput?.isQuestionForUser) {
    return {
      answer: '',
      questionDetected: false,
    };
  }

  const {output: selectAnswerOutput} = await selectAnswerPrompt({
    question: detectQuestionOutput.question!,
    answerBank: answerBank,
    interviewMode: interviewMode,
    resumeData: resumeData,
  });

  return {
    answer: selectAnswerOutput!.answer,
    questionDetected: true,
  };
});

