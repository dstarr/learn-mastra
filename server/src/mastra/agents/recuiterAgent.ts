import { Agent } from '@mastra/core/agent';
import { openai } from "@ai-sdk/openai";
import config from '../../config';

/**
 * Represents an AI-powered recruiter agent designed to ask interview questions.
 * 
 * @constant
 * @type {Agent}
 * @property {string} name - The name of the agent ("Recruiter Agent").
 * @property {string} instructions - The instructions guiding the agent's behavior, 
 * @property {Model} model - The AI model used by the agent, specified in the `OPENAI_MODEL` environment variable.
 */
export const recruiterAgent = new Agent({
  name: "Recruiter Agent",
  instructions: `You are a recruiter asking interview questions.`,
  model: openai(config.OpenAI.model),
});