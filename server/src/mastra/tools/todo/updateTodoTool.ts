import { createTool } from '@mastra/core/tools';
import { ITodoItem } from "../../../todo/ITodoItem";
import { z } from 'zod';
import config from '../../../config';
import TodoItemPostgreRepository from '../../../todo/TodoItemPostgreRepository';


const updateTodoToolInputSchema = z.object({
  id: z.string().describe("Todo item ID"),
  text: z.string().optional().describe("Updated todo text"),
  completed: z.boolean().optional().describe("Updated completion status")
});

const updateTodoToolOutputSchema = z.object({
  success: z.boolean().describe("Indicates if the todo item was successfully updated")
});


/**
 * A tool for updating an existing todo item in the repository.
 *
 * @constant
 * @type {Tool}
 * @description This tool allows partial updates to a todo item by merging the provided
 *              context values with the existing values in the repository. If the todo
 *              item is not found or the update fails, an error is thrown.
 *
 * @property {string} id - The unique identifier for the tool (`update-todo`).
 * @property {string} description - A brief description of the tool's purpose.
 * @property {Schema} inputSchema - The schema defining the expected input for the tool.
 * @property {Schema} outputSchema - The schema defining the expected output for the tool.
 * @property {Function} execute - The function that performs the update operation.
 *
 * @function execute
 * @async
 * @param {Object} params - The parameters for the execution function.
 * @param {Object} params.context - The context containing the update details.
 * @param {string} params.context.id - The ID of the todo item to update.
 * @param {string} [params.context.text] - The new text for the todo item (optional).
 * @param {boolean} [params.context.completed] - The new completion status for the todo item (optional).
 * @returns {Promise<{ success: boolean }>} A promise that resolves to an object indicating
 *                                          whether the update was successful.
 * @throws {Error} If the todo item is not found or the update operation fails.
 */
export const updateTodoTool = createTool({
  id: 'update-todo',
  description: 'Update an existing todo item',
  inputSchema: updateTodoToolInputSchema,
  outputSchema: updateTodoToolOutputSchema,
  execute: async ({ context }) => {

    console.log("🛠️ UPDATE TODO TOOL");
    
    const repository = new TodoItemPostgreRepository({
      dbConfig: config.Postgres,
    });

    let result: boolean = false;
    
    try {

      const currentTodoItem = await repository.getById(context.id);

      if (!currentTodoItem) {
        throw new Error(`Todo item with id ${context.id} not found`);
      }

      // Check if the context has updated values, otherwise use the current values
      // This allows partial updates
      const updatedText: string = context.text ?? currentTodoItem.text; // Use fallback if null
      const updatedCompleted: boolean = context.completed ?? currentTodoItem.completed; // Use fallback if null

      const updatedTodoItem: ITodoItem = {
        ...currentTodoItem, // keep the original id and createdAt values
        text: updatedText,
        completed: updatedCompleted,
      };

      result = await repository.update(updatedTodoItem.id, updatedTodoItem);
      if (!result) {
        throw new Error(`Failed to update todo item with id ${updatedTodoItem.id}`);
      }

      console.log('✅ Todo item updated in repository:', result);

    } catch (error) {
      console.error('Error updating todo item:', error);
      throw new Error(`Failed to update todo item: ${error}`);
    } finally {
      await repository.disconnect();
    }

    return { success: result };
  }
});