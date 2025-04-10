
import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import steps from "./recruitmentSteps";

/**
 * This schema defines the structure of the trigger data for the recruitment workflow.
 * It includes a resume text field that is required.
 * @type {z.ZodObject}
 * @property {string} resumeText - The text of the resume submitted by the candidate.
 */
const resumeSubmissionSchema = z.object({
  resumeText: z.string(),
});

/**
  * Workflow for managing recruitment processes.
  * This workflow is triggered by a resume submission.
  * It gathers candidate information and asks about their specialty and role.
  * @type {Workflow}
  * @property {string} name - The name of the workflow.
  * @property {z.ZodObject} triggerSchema - The schema for the data that triggers this workflow.
 */
export const recruitmentWorkflow = new Workflow({
  name: "recruitment-workflow",
  triggerSchema: resumeSubmissionSchema,
});

recruitmentWorkflow
  .step(steps.gatherCandidateInfoStep)
  .then(steps.askAboutSpecialty, {
    when: { "gatherCandidateInfoStep.isTechnical": true },
  });

recruitmentWorkflow
  .after(steps.gatherCandidateInfoStep)
  .step(steps.askAboutRole, {
    when: { "gatherCandidateInfoStep.isTechnical": false },
  });

recruitmentWorkflow.commit();