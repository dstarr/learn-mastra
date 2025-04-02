
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import agents from './agents';

export const mastra = new Mastra({
  agents: { 
    weatherAgent: agents.weatherAgent,
    todoAgent: agents.todoAgent,
  },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
