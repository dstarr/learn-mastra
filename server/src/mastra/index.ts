
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import agents from './agents';
import workflows from './workflows';

export const mastra = new Mastra({
  agents: { 
    todoAgent: agents.todoAgent,
    recruiterAgent: agents.recruiterAgent,
    githubAgent: agents.githubAgent,
  },
  workflows: {
    recruitmentWorkflow: workflows.recruitmentWorkflow,
    todoWorkflow: workflows.todoWorkflow,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});


