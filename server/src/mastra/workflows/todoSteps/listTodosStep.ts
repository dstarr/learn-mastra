import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import TodoItemMongoRepository from "../../../todo/TodoItemRepository";
import { todoItemSchema } from "../../../todo/schema";

const listTodosStepInputSchema = z.object({});

export const listOutputSchema = z.array(todoItemSchema);

export const listTodosStep = new Step({
  id: "listTodosStep",
  inputSchema: listTodosStepInputSchema,
  outputSchema: listOutputSchema,

  execute: async () => {
    console.log("🔍 LIST TODOS STEP");

    const repository = new TodoItemMongoRepository();
    let result: z.infer<typeof listOutputSchema>;

    try {
      await repository.connect();
      result = await repository.getAll();
    } catch (error) {
      console.error("Error listing todos:", error);
      throw new Error(`Failed to list todos: ${error}`);
    }  finally {
      await repository.disconnect();
    }

    return result;
  }
});
