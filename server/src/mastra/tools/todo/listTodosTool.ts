import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import { listOutputSchema } from "./schema";
import { ITodoItem } from "./ITodoItem";
import { TodoItemRepository } from "./TodoItemRepository";

export const listTodosTool = createTool({
  id: 'list-todos',
  description: 'List all todo items',
  inputSchema: z.object({}),
  outputSchema: listOutputSchema,
  execute: async () => {
    
    const repository = new TodoItemRepository();
    await repository.connect();
    
    const result = await repository.getAll();
    
    await repository.disconnect();
    return result;
  }
}); 

