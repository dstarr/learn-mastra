import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { todoItemSchema } from "../../../todo/schema";
import TodoItemMongoRepository from "../../../todo/TodoItemRepository";

const addTodoStepInputSchema = z.object({
  todoText: z.string(),
});


export const addTodoStep = new Step({
  id: "addTodoStep",
  inputSchema: addTodoStepInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {

    console.log("🔍 ADD TODO STEP");

    const todoText = context?.getStepResult<{
      todoText: string;
    }>("trigger")?.todoText;

    if (!todoText) {
      throw new Error("Todo text is required");
    }

    console.log("Todo text: ", todoText);

    const todoItem = createTodoItem(todoText);

    // Add the todo item to the database
    const repository = new TodoItemMongoRepository();

    try {
      await repository.connect();

      const result = await repository.create(todoItem);
      return result;
    } finally {
      await repository.disconnect();
    }

    return todoItem;

  },
});

function createTodoItem(todoText: string) {
  return {
    id: crypto.randomUUID().toString(),
    text: todoText,
    completed: false,
    createdAt: new Date(),
  };
}
