import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { todoItemSchema } from "../../../todo/schema";
import TodoItemRepository from "../../../todo/TodoItemRepository";
import { ITodoItem } from "../../../todo/ITodoItem";

const updateTodoStepInputSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
  completed: z.boolean().optional(),
});

export const updateTodoStep = new Step({
  id: "updateTodoStep",
  inputSchema: updateTodoStepInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {

    console.log("🔍 UPDATE TODO STEP");
    console.debug(`🔍 ${JSON.stringify(context.triggerData)}`);

    const triggerData: z.infer<typeof updateTodoStepInputSchema> = context.triggerData;

    if (!triggerData.id) {
      throw new Error("ID is required");
    }

    const todoItemRepository = new TodoItemRepository();

    try {

      await todoItemRepository.connect();

      const existingTodoItem = await todoItemRepository.getById(triggerData.id);

      if (!existingTodoItem) {
        throw new Error(`Todo item with id ${triggerData.id} not found`);
      }

      const updatedText = triggerData.text ?? existingTodoItem.text; // Use fallback if null
      const updatedCompleted = triggerData.completed ?? existingTodoItem.completed; // Use fallback if null

      const updatedTodoItem: ITodoItem = {
        ...existingTodoItem, // keep the original id and createdAt values
        text: updatedText,
        completed: updatedCompleted,
      };

      const result: boolean = await todoItemRepository.update(updatedTodoItem.id, updatedTodoItem);
      if (!result) {
        throw new Error(`Failed to update todo item with id ${updatedTodoItem.id}`);
      }

      console.log('✅ Todo item updated in repository:', result);

      return updatedTodoItem;

    } finally {
      await todoItemRepository.disconnect();
    }

  }
});
