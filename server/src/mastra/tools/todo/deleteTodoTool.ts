import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import TodoItemRepository from "./TodoItemRepository";

export const deleteTodoToolInputSchema = z.object({
  id: z.string().describe("Todo item ID")
});
export const deleteTodoToolOutputSchema = z.object({
  success: z.boolean().describe("Indicates whether the deletion was successful")
});

export const deleteTodoTool = createTool({
  id: 'delete-todo',
  description: 'Delete a todo item',
  inputSchema: deleteTodoToolInputSchema,
  outputSchema: deleteTodoToolOutputSchema,
  execute: async ({ context }) => {
    
    console.log("🔍 DELETE TODO TOOL");

    const todoItemRepository = new TodoItemRepository();
    let result: boolean; 
    
    try {
    
      await todoItemRepository.connect();

      result = await todoItemRepository.delete(context.id);

      console.log('✅ Todo item deleted from repository:', result);

  }
  catch (error) {
    console.error('❌ Error deleting todo item:', error);
    throw new Error(`Failed to delete todo item with id ${context.id}`);
  } finally {
    await todoItemRepository.disconnect();
  }

  return { success: result };

}
}); 
