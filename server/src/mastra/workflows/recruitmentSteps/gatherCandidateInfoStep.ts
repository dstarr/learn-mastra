import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { recruiterAgent } from "../../agents/recuiterAgent";

/**
 * This step is responsible for gathering candidate information from the resume text.
 */
const gatherCandidateInfoStepInputSchema = z.object({
  resumeText: z.string(),
});

/**
 * This schema defines the structure of the output data for the gatherCandidateInfoStep.
 */
const gatherCandidateInfoStepOutputSchema = z.object({
  candidateName: z.string(),
  isTechnical: z.boolean(),
  specialty: z.string(),
  resumeText: z.string(),
});

/**
 * This schema defines the structure of the output data for the recruiter agent.
 */
const recruiterAgentOutputScema = {
  output: z.object({
    candidateName: z.string(),
    isTechnical: z.boolean(),
    specialty: z.string(),
    resumeText: z.string(),
  }),
};

/**
 * This step is responsible for gathering candidate information from the resume text.
 * It extracts the candidate's name, technical expertise, specialty, and the resume text itself.
 * 
 * @type {Step}
 * @property {string} id - The unique identifier for the step (`gatherCandidateInfoStep`).
 * @property {z.ZodObject} inputSchema - The schema defining the input structure for the step.
 * @property {z.ZodObject} outputSchema - The schema defining the output structure for the step.
 * @property {Function} execute - The function that performs the step's operation.
 */
export const gatherCandidateInfoStep = new Step({
  id: "gatherCandidateInfoStep",
  inputSchema: gatherCandidateInfoStepInputSchema,
  outputSchema: gatherCandidateInfoStepOutputSchema,
  execute: async ({ context }) => {

    console.log("🔍 GATHER CANDIDATE INFO STEP");
    
    const triggerData: z.infer<typeof gatherCandidateInfoStepInputSchema> = context.triggerData;
    const resumeText = triggerData.resumeText;

    const prompt = `
            Extract details from thefollowing resume text.
            Look for and return the following if present.
            - Candidate name
            - If the candidate is technical
            - Candidate specialty
            "${resumeText}"
          `;
    const result = await recruiterAgent.generate(prompt, recruiterAgentOutputScema);
    if (!result) {
      throw new Error("Failed to gather candidate information");
    }

    return result.object;
  },
});
