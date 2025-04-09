import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { todoAgent } from "../../agents/todoAgent";
import { todoItemSchema } from "../../tools/todo/schema";
import { todo } from "node:test";

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

    // Use the todoAgent with very specific instructions
    const prompt = `Add a new todo with the text: "${todoText}"
                    Then return ONLY the added todo item as a JSON object.`;

    // Use the agent with structured output
    const res = await todoAgent.generate(prompt, {
      output: todoItemSchema
    });

    // If the agent successfully returned a structured object
    if (res.object) {
      return res.object;
    }
    
    // Fallback: Try to extract the JSON object from the text response
    const responseText = res.toString();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse todo from response");
    }
    
    try {
      const todoObject = JSON.parse(jsonMatch[0]);
      return todoObject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error("Failed to parse todo JSON: " + errorMessage);
    }
  },
}); 