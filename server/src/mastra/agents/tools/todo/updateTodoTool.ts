import { createTool } from '@mastra/core/tools';
import { TodoItem } from "./ITodoItem";
import { todoItemSchema, updateInputSchema } from "./schema";
import { todos } from "./inMemoryStorage";

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