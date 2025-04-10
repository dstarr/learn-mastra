import { z } from "zod";

/**
 * General purpose schema definition for a Todo item.
 * 
 * This schema validates the structure of a Todo item object, ensuring that
 * it adheres to the following properties:
 * 
 * - `_id` (optional): A string representing the unique identifier of the item assigned by the database. Do not set this value.
 * - `id`: A string representing the unique identifier of the item.
 * - `text`: A string containing the description or content of the Todo item.
 * - `completed`: A boolean indicating whether the Todo item is completed.
 * - `createdAt`: A date object representing when the Todo item was created.
 * 
 * This schema is useful for validating data consistency and ensuring that
 * the Todo item objects conform to the expected structure.
 */
export const todoItemSchema = z.object({
    _id: z.string().optional(),
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
    createdAt: z.date(),
  });
  

  