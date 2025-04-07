import { z } from "zod";
import { createTool } from '@mastra/core/tools';
import { TodoItem } from "./ITodoItem";
import { addInputSchema, deleteInputSchema, listOutputSchema, todoItemSchema, updateInputSchema } from "./schema";


// In-memory storage
const todos: Map<string, TodoItem> = new Map();

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15);

// Tools
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

export const updateTodoTool = createTool({
  id: 'update-todo',
  description: 'Update an existing todo item',
  inputSchema: updateInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {
    const todo = todos.get(context.id);
    if (!todo) {
      throw new Error(`Todo with ID '${context.id}' not found`);
    }

    const updatedTodo = {
      ...todo,
      text: context.text ?? todo.text,
      completed: context.completed ?? todo.completed
    };
    
    todos.set(context.id, updatedTodo);
    return updatedTodo;
  }
});

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

export const listTodosTool = createTool({
  id: 'list-todos',
  description: 'List all todo items',
  inputSchema: z.object({}),
  outputSchema: listOutputSchema,
  execute: async () => {
    return Array.from(todos.values());
  }
});

