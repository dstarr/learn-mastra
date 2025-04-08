import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import steps from "./steps";

const triggerSchema = z.object({
  operation: z.enum(["add", "update", "delete", "list"]),
  todoText: z.string().optional(),
  todoId: z.string().optional(),
  completed: z.boolean().optional(),
});

export const todoWorkflow = new Workflow({
    name: "todo-workflow",
    triggerSchema,
  })
  .step(steps.addTodoStep, {
    when: { "trigger.operation": "add" },
  })
  .step(steps.updateTodoStep, {
    when: { "trigger.operation": "update" },
  })
  .step(steps.deleteTodoStep, {
    when: { "trigger.operation": "delete" },
  })
  .step(steps.listTodosStep, {
    when: { "trigger.operation": "list" },
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