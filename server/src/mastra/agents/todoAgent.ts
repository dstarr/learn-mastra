import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { tools } from "../tools";

export const todoAgent = new Agent({
  name: "To Do Agent",
  instructions: `
      You can help users manage their todo list.
      You can add, update, and delete todos.
      You can also list all todos.
      Use the todoTool to manage the todo list.
      When listing todos, include the text, completed, and createdAt.
      SHow the createdAt as local time in simple format
      Format the todos as a table.
`,
  model: openai(process.env.OPENAI_MODEL || 'gpt-3.5-turbo'),
  tools: {
    addTodoTool: tools.addTodoTool,
    deleteTodoTool: tools.deleteTodoTool,
    listTodosTool: tools.listTodosTool,
    updateTodoTool: tools.updateTodoTool
  },
});

