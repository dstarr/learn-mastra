import { Step } from "@mastra/core";
import { z } from "zod";
import ICandidateInfo from "./ICandidateInfo";
import { recruiterAgent } from "../../agents/recuiterAgent";

/**
 * The question the interviewer will ask the candidate about their role.
 * @typedef {Object} AskAboutRoleStepOutput
 * @property {string} question - The question to ask the candidate about their role.
 */
const askABoutRoleStepOutputSchema = z.object({
  question: z.string(),
});

/**
 * This step is responsible for asking the candidate about their role.
 * It generates a question based on the candidate's resume and role using an Agent.
 *
 * @type {Step}
 * @property {string} id - The unique identifier for the step (`askAboutRole`).
 * @property {z.ZodObject} outputSchema - The schema defining the output structure for the step.
 * @property {Function} execute - The function that performs the step's operation.
 */
export const askAboutRoleStep = new Step({
    id: "askAboutRole",
    outputSchema: askABoutRoleStepOutputSchema,
    execute: async ({ context }) => {
      
      console.log("🔍 ASK ABOUT ROLE STEP");
      
      const candidateInfo = context?.getStepResult<ICandidateInfo>(
        "gatherCandidateInfoStep",
      );

      const prompt = `
            You are a recruiter. Given the resume below, craft a short question
            for ${candidateInfo?.candidateName} asking what interests them most about this role.
            Resume: ${candidateInfo?.resumeText}
          `;
      const res = await recruiterAgent.generate(prompt);
      console.log("✅ Recruiter Agent Response : ROLE");
      console.log(res.text);
      return { question: res?.text?.trim() || "" };
    },
  });