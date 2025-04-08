import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import { listOutputSchema } from "./schema";
import { todos } from "./inMemoryStorage";

export const listTodosTool = createTool({
  id: 'list-todos',
  description: 'List all todo items',
  inputSchema: z.object({}),
  outputSchema: listOutputSchema,
  execute: async () => {
    return Array.from(todos.values());
  }
}); 