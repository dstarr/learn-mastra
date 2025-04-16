import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";
import { tools } from "../tools";

// PostgreSQL connection details
const host = process.env.POSTGRES_HOST || "localhost";
const port = parseInt(process.env.POSTGRES_PORT as string, 10) || 5432;
const user = process.env.USERNAME || "postgres";
const database = process.env.DB_NAME || "mastra";
const password = process.env.POSTGRES_PASSWORD || "postgres";
const connectionString = `postgresql://${user}:${password}@${host}:${port}`;

// Initialize memory with PostgreSQL storage and vector search
const memory = new Memory({
  storage: new PostgresStore({
    host: host,
    port: port,
    user: user,
    database: database,
    password: password,
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
  model: openai(process.env.OPENAI_MODEL || 'gpt-3.5-turbo'),
  memory,
  tools: {
    addTodoTool: tools.addTodoTool,
    deleteTodoTool: tools.deleteTodoTool,
    listTodosTool: tools.listTodosTool,
    updateTodoTool: tools.updateTodoTool
  },
});

