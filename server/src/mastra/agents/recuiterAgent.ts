import { Agent } from '@mastra/core/agent';
import { openai } from "@ai-sdk/openai";
 
export const recruiterAgent = new Agent({
  name: "Recruiter Agent",
  instructions: `You are a recruiter.`,
  model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
})