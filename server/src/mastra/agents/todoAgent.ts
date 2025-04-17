import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { tools } from "../tools";
import config from "../../config";

// PostgreSQL connection details
const host = config.Postgres.host
const port = config.Postgres.port;
const user = config.Postgres.user;
const database = config.Postgres.database;
const password = config.Postgres.password;
const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;

// Initialize memory with PostgreSQL storage and vector search
const memory = new Memory({
  storage: new PostgresStore({
    connectionString: connectionString,
  }),
  vector: new PgVector(connectionString),
  options: {
    lastMessages: 10,
    semanticRecall: {
      topK: 3,
      messageRange: 2,
    },
  },
});

export const todoAgent = new Agent({
  name: "To Do Agent",
  instructions: `
      You can help users manage their todo list.
      You can add, update, and delete todos.
      You can also list all todos.
      Use the todoTool to manage the todo list.
      When listing todos, include the text, completed, and createdAt.
      Show the createdAt as local time in simple format
      When listing items, format the todos as a table.
`,
  model: openai(config.OpenAI.model),
  memory,
  tools: {
    addTodoTool: tools.addTodoTool,
    deleteTodoTool: tools.deleteTodoTool,
    listTodosTool: tools.listTodosTool,
    updateTodoTool: tools.updateTodoTool
  },
});

