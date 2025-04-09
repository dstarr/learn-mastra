import { createTool } from '@mastra/core/tools';
import { TodoItem } from "./ITodoItem";
import { addInputSchema, todoItemSchema } from "./schema";
import { MongoClient, UUID } from 'mongodb';
import { randomUUID } from 'crypto';
import { text } from 'stream/consumers';


// Helper function
const generateId = () => Math.random().toString(36).substring(2, 15);

// MongoDB connection
const connectionString = process.env.AZURE_COSMOS_DB_CS as string
const dbName = process.env.AZURE_COSMOS_DB_DATABASE as string;
const collectionName = process.env.AZURE_COSMOS_DB_COLLECTION as string;

const client = new MongoClient(connectionString, {});
const db = client.db(dbName);
const collection = db.collection(collectionName);


// Add Todo Tool
export const addTodoTool = createTool({
  id: 'add-todo',
  description: 'Add a new todo item',
  inputSchema: addInputSchema,
  outputSchema: todoItemSchema,
  execute: async ({ context }) => {

    const newTodo: TodoItem = createTodoItem(context.text);

    // Add the new todo item to the database
    const result = await addTodoToDatabase(newTodo);
    if (!result) {
      throw new Error('Failed to add todo item to the database');
    }

    console.log('New todo item added result:', result);

    return newTodo;
  }
});

// Function to create a new todo item
function createTodoItem(text: string ): TodoItem {
  return {
    id: randomUUID(),
    text: text,
    completed: false,
    createdAt: new Date()
  };
}

// Function to add a todo item to the database
async function addTodoToDatabase(todo: TodoItem) {

  console.log('Adding todo to database:', todo);

  client.connect()
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err);
    });


  try {
    const result = await collection.insertOne(todo);
    console.log('Todo added to database:', result);
    return result; // Return the result of the insert operation
  } catch (error) {
    console.error('Error adding todo to database:', error);
    throw error; // Re-throw the error to handle it in the caller
  }
  finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}
