import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { todoAgent } from "../../agents/todoAgent";
import { listOutputSchema } from "../../agents/tools/todo/schema";

const listTodosStepInputSchema = z.object({});

export const listTodosStep = new Step({
  id: "listTodosStep",
  inputSchema: listTodosStepInputSchema,
  outputSchema: listOutputSchema,
  
  execute: async () => {
    console.log("🔍 LIST TODOS STEP");

    const prompt = `list the todo items as a table.
                    `;

    // Use the agent with structured o  utput - array of todos
    try {
      const res = await todoAgent.generate(prompt, {
        output: z.object({ 
          todos: listOutputSchema.optional()
        })
      });

      // If the agent successfully returned a structured array
      if (res.object) {
        console.log("🔍 LIST TODOS STEP RES OBJECT", res.object);
        return res.object;
      }

      // Fallback: Try to extract the JSON array from the text response
      const responseText = res.toString();
      const jsonMatch = responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);

      if (!jsonMatch) {
        throw new Error("Could not parse todos list from response");
      }

      const todosArray = JSON.parse(jsonMatch[0]);
      return todosArray;

    } catch (error) {
      console.error("🔴 ERROR IN LIST TODOS STEP", error);
      throw error;
    }
  },
});
