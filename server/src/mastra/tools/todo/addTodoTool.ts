import { createTool } from '@mastra/core/tools';
import { ITodoItem } from "./ITodoItem";
import { addInputSchema, todoItemSchema } from "./schema";
import TodoItemRepository from './TodoItemRepository';


// Helper function
const generateId = () => Math.random().toString(36).substring(2, 15);


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
  description: 'Add a new todo item',
  inputSchema: addInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {
    
    const todoItemRepository = new TodoItemRepository();
    await todoItemRepository.connect();
  
    const result = await todoItemRepository.create(context.text);
  
    console.log('✅ Todo item added to repository:', result);
  
    await todoItemRepository.disconnect();
  
    return result;
  }
});