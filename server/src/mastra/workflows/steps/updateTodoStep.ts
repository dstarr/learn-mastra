import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { todoAgent } from "../../agents/todoAgent";

const updateTodoStepInputSchema = z.object({
  todoId: z.string(),
  todoText: z.string().optional(),
  completed: z.boolean().optional(),
});

const updateTodoStepOutputSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  createdAt: z.string(),
});

export const updateTodoStep = new Step({
  id: "updateTodoStep",
  inputSchema: updateTodoStepInputSchema,
  outputSchema: updateTodoStepOutputSchema,
  execute: async ({ context }) => {
    
    console.log("🔍 UPDATE TODO STEP");

    const triggerData = context?.getStepResult<{
      todoId: string;
      todoText?: string;
      completed?: boolean;
    }>("trigger");

    if (!triggerData?.todoId) {
      throw new Error("Todo ID is required");
    }

    let prompt = `Update todo with ID: "${triggerData.todoId}"`;
    
    if (triggerData.todoText) {
      prompt += ` with new text: "${triggerData.todoText}"`;
    }
    
    if (triggerData.completed !== undefined) {
      prompt += ` and set completed to: ${triggerData.completed}`;
    }
    
    prompt += `\nThen return ONLY the updated todo item as a JSON object with these fields:
{
  "id": "${triggerData.todoId}",
  "text": "the updated text",
  "completed": true or false,
  "createdAt": "formatted date string"
}`;

    const res = await todoAgent.generate(prompt, {
      output: z.object({
        id: z.string(),
        text: z.string(),
        completed: z.boolean(),
        createdAt: z.string(),
      })
    });

    if (res.object) {
      return res.object;
    }
    
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