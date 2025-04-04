
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import agents from './agents';
import workflows from './workflows';

export const mastra = new Mastra({
  agents: { 
    weatherAgent: agents.weatherAgent,
    todoAgent: agents.todoAgent,
    recruiterAgent: agents.recruiterAgent,
  },
  workflows: {
    interviewWorkflow: workflows.interviewWorkflow,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});


