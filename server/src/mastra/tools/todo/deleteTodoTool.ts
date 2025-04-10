import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import TodoItemRepository from "../../../todo/TodoItemRepository";


/**
 * This schema ensures that the input contains a valid `id` field,
 * which is a string representing the unique identifier of the Todo item
 * to be deleted.
 * 
 * @property id - A string that specifies the Todo item ID.
 */
const deleteTodoToolInputSchema = z.object({
  id: z.string().describe("Todo item ID")
});

/**
 * This schema defines the structure of the output returned by the deleteTodoTool.
 * It includes a success property indicating whether the deletion was successful.
 *
 * @constant
 * @type {Schema}
 * @property {boolean} success - Indicates whether the deletion was successful.
 */
const deleteTodoToolOutputSchema = z.object({
  success: z.boolean().describe("Indicates whether the deletion was successful")
});

/**
 * A tool for deleting a todo item.
 *
 * This tool is created using the `createTool` function and is responsible for
 * removing a todo item from the repository. It uses the `TodoItemRepository`
 * to perform the deletion operation.
 *
 * @constant
 * @type {Tool}
 * @property {string} id - The unique identifier for the tool (`delete-todo`).
 * @property {string} description - A brief description of the tool's purpose.
 * @property {Schema} inputSchema - The schema defining the input structure for the tool.
 * @property {Schema} outputSchema - The schema defining the output structure for the tool.
 * @property {Function} execute - The function that performs the deletion operation.
 * 
 * @throws {Error} Throws an error if the deletion operation fails.
 */
export const deleteTodoTool = createTool({
  id: 'delete-todo',
  description: 'Delete a todo item',
  inputSchema: deleteTodoToolInputSchema,
  outputSchema: deleteTodoToolOutputSchema,
  execute: async ({ context }) => {

    console.log("🛠️ DELETE TODO TOOL");

    let result: boolean;
    const todoItemRepository = new TodoItemRepository();

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
