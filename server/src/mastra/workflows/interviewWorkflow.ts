 
import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import steps from "./steps";

export const interviewWorkflow = new Workflow({
  name: "interview-workflow",
  triggerSchema: z.object({
    resumeText: z.string(),
  }),
});
 
interviewWorkflow
  .step(steps.gatherCandidateInfoStep)
  .then(steps.askAboutSpecialty, {
    when: { "gatherCandidateInfoStep.isTechnical": true },
  })
  .after(steps.gatherCandidateInfoStep)
  .step(steps.askAboutRole, {
    when: { "gatherCandidateInfoStep.isTechnical": false },
  });
 
interviewWorkflow.commit();