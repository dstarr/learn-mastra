import { Step } from "@mastra/core";
import { z } from "zod";
import ICandidateInfo from "./ICandidateInfo";
import { recruiterAgent } from "../../agents/recuiterAgent";

export const askAboutRole = new Step({
    id: "askAboutRole",
    outputSchema: z.object({
      question: z.string(),
    }),
    execute: async ({ context }) => {
      
      console.log("✅ TECHNICAL ROLE STEP");
      
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