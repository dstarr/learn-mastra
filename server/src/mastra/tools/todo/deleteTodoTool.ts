import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import { deleteInputSchema } from "./schema";
import TodoItemRepository from "./TodoItemRepository";

export const deleteTodoTool = createTool({
  id: 'delete-todo',
  description: 'Delete a todo item',
  inputSchema: deleteInputSchema,
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ context }) => {
    
    const todoItemRepository = new TodoItemRepository();
    await todoItemRepository.connect();

    const result = await todoItemRepository.delete(context.id);

    console.log('✅ Todo item deleted from repository:', result);

    await todoItemRepository.disconnect();

    return {
      success: result
    };
  }
}); 
