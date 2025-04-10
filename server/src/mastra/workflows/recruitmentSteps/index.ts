import { gatherCandidateInfoStep } from "./gatherCandidateInfoStep";
import { askAboutSpecialtyStep } from "./askAboutSpecialtyStep";
import { askAboutRoleStep } from "./askAboutRoleStep";

/**
 * This module exports the steps used in the recruitment workflow.
 * Each step is responsible for a specific part of the recruitment process.
 * 
 * @module recruitmentSteps
 */
export default {
  gatherCandidateInfoStep,
  askAboutSpecialty: askAboutSpecialtyStep,
  askAboutRole: askAboutRoleStep,
};

