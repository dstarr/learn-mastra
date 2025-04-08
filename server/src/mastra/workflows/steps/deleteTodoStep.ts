import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { todoAgent } from "../../agents/todoAgent";

const deleteTodoStepInputSchema = z.object({
  todoId: z.string(),
});

const deleteTodoStepOutputSchema = z.object({
  success: z.boolean(),
});

export const deleteTodoStep = new Step({
  id: "deleteTodoStep",
  inputSchema: deleteTodoStepInputSchema,
  outputSchema: deleteTodoStepOutputSchema,
  execute: async ({ context }) => {

    console.log("🔍 DELETE TODO STEP");

    const todoId = context?.getStepResult<{
      todoId: string;
    }>("trigger")?.todoId;

    if (!todoId) {
      throw new Error("Todo ID is required");
    }

    const prompt = `Delete todo with ID: "${todoId}"
                    Then return ONLY a JSON object with a success field like this:
                    {
                      "success": true
                    }`;

    // Use the agent with structured output
    const res = await todoAgent.generate(prompt, {
      output: z.object({
        success: z.boolean(),
      })
    });

    // If the agent successfully returned a structured object
    if (res.object) {
      return res.object;
    }
    
    // Fallback: Try to extract the JSON object from the text response
    const responseText = res.toString();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Could not parse success response");
    }
    
    try {
      const resultObject = JSON.parse(jsonMatch[0]);
      return resultObject;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error("Failed to parse response JSON: " + errorMessage);
    }
  },
}); 