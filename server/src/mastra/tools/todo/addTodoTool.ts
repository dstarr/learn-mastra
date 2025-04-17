import { createTool } from '@mastra/core/tools';
import { ITodoItem } from "../../../todo/ITodoItem";
import { todoItemSchema } from "../../../todo/schema";
import TodoItemPostgreRepository from '../../../todo/TodoItemPostgreRepository';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import config from '../../../config';

/**
 * This schema ensures that the input object contains a `text` property,
 * which must be a string. The `text` property represents the content
 * of the todo item to be added.
 */
const addTodoToolInputSchema = z.object({
  text: z.string().describe("Todo item text")
});

/**
 * A tool for adding a new todo item to the repository.
 *
 * @constant
 * @type {Tool}
 * @property {string} id - The unique identifier for the tool, set to 'add-todo'.
 * @property {string} description - A brief description of the tool's purpose.
 * @property {Schema} inputSchema - The schema defining the structure of the input data.
 * @property {Schema} outputSchema - The schema defining the structure of the output data.
 * @property {Function} execute - An asynchronous function that performs the action of adding a todo item.
 * @param {Object} execute.context - The execution context containing the input text for the todo item.
 * @returns {Promise<TodoItem>} A promise that resolves to the newly added todo item.
 */
export const addTodoTool = createTool({
  id: 'add-todo',
  description: 'Add a new todo item taking in a text string',
  inputSchema: addTodoToolInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {

    console.log("🛠️ ADD TODO TOOL");

    let result: ITodoItem | null = null;
    
    const todoItem: ITodoItem = {
      id: randomUUID().toString(),
      text: context.text,
      completed: false,
      createdAt: new Date()
    };
    
    const todoItemRepository = new TodoItemPostgreRepository({
      dbConfig: config.Postgres,
    });
    
    try {
      
      result = await todoItemRepository.create(todoItem);
      if (!result) {
        throw new Error('Failed to create todo item: result is null');
      }

      console.log('✅ Todo item added to repository:', result);


    } catch (error) {
      console.error('❌ Error adding todo item to repository:', error);
      throw new Error('Failed to add todo item');
    } finally {
      await todoItemRepository.disconnect();
    }

    return result;
  }
});