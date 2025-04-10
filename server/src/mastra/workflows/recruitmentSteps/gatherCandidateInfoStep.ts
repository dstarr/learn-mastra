import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { recruiterAgent } from "../../agents/recuiterAgent";

const gatherCandidateInfoStepInputSchema = z.object({
  resumeText: z.string(),
});

const gatherCandidateInfoStepOutputSchema = z.object({
  candidateName: z.string(),
  isTechnical: z.boolean(),
  specialty: z.string(),
  resumeText: z.string(),
});

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

    const res = await recruiterAgent.generate(prompt, {
      output: z.object({
        candidateName: z.string(),
        isTechnical: z.boolean(),
        specialty: z.string(),
        resumeText: z.string(),
      }),
    });

    return res.object;
  },
});
