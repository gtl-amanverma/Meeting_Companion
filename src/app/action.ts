"use server";

import { answerMeetingQuestion } from "@/ai/flows/answer-meeting-questions";
import type { AnswerMeetingQuestionInput } from "@/ai/flows/answer-meeting-questions";

export async function getAnswerAction(input: AnswerMeetingQuestionInput) {
  try {
    const output = await answerMeetingQuestion(input);
    return { success: true, data: output };
  } catch (error) {
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, error: errorMessage };
  }
}
