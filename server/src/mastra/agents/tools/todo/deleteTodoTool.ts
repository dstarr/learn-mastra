import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import { deleteInputSchema } from "./schema";
import { todos } from "./inMemoryStorage";

export const deleteTodoTool = createTool({
  id: 'delete-todo',
  description: 'Delete a todo item',
  inputSchema: deleteInputSchema,
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ context }) => {
    if (!todos.has(context.id)) {
      throw new Error(`Todo with ID '${context.id}' not found`);
    }
    
    todos.delete(context.id);
    return { success: true };
  }
}); 
