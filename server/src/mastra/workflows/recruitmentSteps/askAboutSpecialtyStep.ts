import { recruiterAgent } from "../../agents/recuiterAgent";
import ICandidateInfo from "./ICandidateInfo";
import { Step } from "@mastra/core/workflows";
import { z } from "zod";

/**
 * The question the interviewer will ask the candidate about their specialty.
 * @typedef {Object} AskAboutSpecialtyStepOutput
 * @property {string} question - The question to ask the candidate about their specialty.
 */
const askAboutSpecialtyTepOutputSchema = z.object({
  question: z.string(),
});

/**
 * This step is responsible for asking the candidate about their specialty.
 * It generates a question based on the candidate's resume and specialty.
 * 
 * @type {Step}
 * @property {string} id - The unique identifier for the step (`askAboutSpecialty`).
 * @property {z.ZodObject} outputSchema - The schema defining the output structure for the step.
 * @property {Function} execute - The function that performs the step's operation.
 */
export const askAboutSpecialtyStep = new Step({
  id: "askAboutSpecialty",
  outputSchema: askAboutSpecialtyTepOutputSchema,
  execute: async ({ context }) => {
    
    console.log("🔍 ASK ABOUT SPECIALTY STEP");

    const candidateInfo = context?.getStepResult<ICandidateInfo>(
      "gatherCandidateInfoStep",
    );

    const prompt = `
            You are a recruiter. Given the resume below, craft a short question
            for ${candidateInfo?.candidateName} about how they got into "${candidateInfo?.specialty}".
            Resume: ${candidateInfo?.resumeText}
          `;
    const res = await recruiterAgent.generate(prompt);

    console.log(res.text);

    return { question: res?.text?.trim() || "" };
  },
});
