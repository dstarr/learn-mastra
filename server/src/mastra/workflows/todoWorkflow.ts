import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import steps from "./todoSteps";

/**
 * Enum for the different operations that can be performed in the todo workflow.
 * @enum {string}
 * @property {string} ADD - Add a new todo item.
 * @property {string} UPDATE - Update an existing todo item.
 * @property {string} DELETE - Delete a todo item.
 * @property {string} LIST - List all todo items.
 */
const enum TodoOperation {
  ADD = "add",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
}

/**
 * This schema defines the structure of the trigger data for the todo workflow.
 */
const triggerSchema = z.object({
  operation: z.enum(
    [ TodoOperation.ADD, 
      TodoOperation.UPDATE, 
      TodoOperation.DELETE, 
      TodoOperation.LIST],
    {
      required_error: "Operation is required",
      invalid_type_error: "Invalid operation type",
    }
  )
  .describe("Operation to perform"),
  _id: z.string().optional(), // optional, for MongoDB
  createdAt: z.date().optional(),
  id: z.string().optional(),
  text: z.string().optional(),
});

/**
 * Workflow for managing Todo items.
 */
export const todoWorkflow = new Workflow({
    name: "todo-workflow",
    triggerSchema,
  })
  .step(steps.addTodoStep, {
    when: { "trigger.operation": TodoOperation.ADD },
  })
  .step(steps.updateTodoStep, {
    when: { "trigger.operation": TodoOperation.UPDATE },
  })
  .step(steps.deleteTodoStep, {
    when: { "trigger.operation": TodoOperation.DELETE },
  })
  .step(steps.listTodosStep, {
    when: { "trigger.operation": TodoOperation.LIST },
  });

// Add step to always list todos after add operation
todoWorkflow
  .after(steps.addTodoStep)
  .step(steps.listTodosStep);

// Add step to always list todos after update operation
todoWorkflow
  .after(steps.updateTodoStep)
  .step(steps.listTodosStep);

// Add step to always list todos after delete operation
todoWorkflow
  .after(steps.deleteTodoStep)
  .step(steps.listTodosStep);

todoWorkflow.commit();