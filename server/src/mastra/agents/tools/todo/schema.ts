import { z } from "zod";

export const addInputSchema = z.object({
    text: z.string().describe("Todo item text")
  });
  
export const updateInputSchema = z.object({
    id: z.string().describe("Todo item ID"),
    text: z.string().optional().describe("Updated todo text"),
    completed: z.boolean().optional().describe("Updated completion status")
  });
  
export const deleteInputSchema = z.object({
    id: z.string().describe("Todo item ID")
  });
  
export const todoItemSchema = z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
    createdAt: z.string()
  });
  
export const listOutputSchema = z.array(todoItemSchema);
  