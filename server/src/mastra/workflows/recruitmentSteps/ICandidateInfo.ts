/**
 * @file ICandidateInfo.ts
 * @description This file defines the ICandidateInfo interface, which is used to
 * represent the information of a candidate in the recruitment process.
 */
export default interface ICandidateInfo {
  candidateName: string;
  isTechnical: boolean;
  specialty: string;
  resumeText: string;
}