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
    const resumeText = context?.getStepResult<{
      resumeText: string;
    }>("trigger")?.resumeText;

    const prompt = `
            Extract details from the resume text:
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
