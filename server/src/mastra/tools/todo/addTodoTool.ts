import { createTool } from '@mastra/core/tools';
import { TodoItem } from "./ITodoItem";
import { addInputSchema, todoItemSchema } from "./schema";
import { todos } from "./inMemoryStorage";

// Helper function
const generateId = () => Math.random().toString(36).substring(2, 15);

// Add Todo Tool
export const addTodoTool = createTool({
  id: 'add-todo',
  description: 'Add a new todo item',
  inputSchema: addInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {
    
    const newTodo: TodoItem = {
      id: generateId(),
      text: context.text,
      completed: false,
      createdAt: new Date().toString()
    };
    todos.set(newTodo.id, newTodo);

    return newTodo;
  }
}); 