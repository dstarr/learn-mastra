import { z } from "zod";
import { recruiterAgent } from "../../agents/recuiterAgent";
import ICandidateInfo from "./ICandidateInfo";
import { Step } from "@mastra/core/workflows";

export const askAboutSpecialty = new Step({
id: "askAboutSpecialty",
    outputSchema: z.object({
      question: z.string(),
    }),
    execute: async ({ context }) => {
      console.log("✅ NON TECHNICAL ROLESTEP");

      const candidateInfo = context?.getStepResult<ICandidateInfo>(
        "gatherCandidateInfoStep",
      );
   
      
      const prompt = `
            You are a recruiter. Given the resume below, craft a short question
            for ${candidateInfo?.candidateName} about how they got into "${candidateInfo?.specialty}".
            Resume: ${candidateInfo?.resumeText}
          `;
      const res = await recruiterAgent.generate(prompt);
  
      console.log("✅ Recruiter Agent Response : SPECIALTY");
      console.log(res.text);
  
      return { question: res?.text?.trim() || "" };
    },
  });
