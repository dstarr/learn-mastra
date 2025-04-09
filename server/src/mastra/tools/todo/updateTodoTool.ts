import { createTool } from '@mastra/core/tools';
import { ITodoItem } from "./ITodoItem";
import { updateInputSchema } from "./schema";
import TodoItemRepository from './TodoItemRepository';
import { z } from 'zod';

export const updateTodoTool = createTool({
  id: 'update-todo',
  description: 'Update an existing todo item',
  inputSchema: updateInputSchema,
  outputSchema: z.object({ success: z.boolean() }),
  execute: async ({ context }) => {
    
    const todoItemRepository = new TodoItemRepository();
    await todoItemRepository.connect();

    const todoItem = await todoItemRepository.getById(context.id);

    if (!todoItem) {
      throw new Error(`Todo item with id ${context.id} not found`);
    }
    
    const updatedText = context.text ?? todoItem.text; // Use fallback if null
    const updatedCompleted = context.completed ?? todoItem.completed; // Use fallback if null

    const updatedTodoItem: ITodoItem = {
      ...todoItem, // keep the original id and createdAt values
      text: updatedText,
      completed: updatedCompleted,
    };

    const result: boolean = await todoItemRepository.update(updatedTodoItem.id, updatedTodoItem);
    if (!result) {
      throw new Error(`Failed to update todo item with id ${updatedTodoItem.id}`);
    }

    console.log('✅ Todo item updated in repository:', result);

    await todoItemRepository.disconnect();

    return { success: result };
  }
});