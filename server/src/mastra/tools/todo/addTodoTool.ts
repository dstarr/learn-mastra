import { createTool } from '@mastra/core/tools';
import { ITodoItem } from "./ITodoItem";
import { addInputSchema, todoItemSchema } from "./schema";
import TodoItemRepository from './TodoItemRepository';


// Helper function
const generateId = () => Math.random().toString(36).substring(2, 15);

// Add Todo Tool
export const addTodoTool = createTool({
  id: 'add-todo',
  description: 'Add a new todo item',
  inputSchema: addInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {

    return await addTodoToRepository(context.text);

  }
});

// add to repository
async function addTodoToRepository(text: string): Promise<ITodoItem> {
  
  const todoItemRepository = new TodoItemRepository();
  await todoItemRepository.connect();

  const result = await todoItemRepository.create(text);

  console.log('Todo item added to repository:', result);

  await todoItemRepository.disconnect();

  return result;
}