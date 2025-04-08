import { TodoItem } from "./ITodoItem";

// In-memory storage
export const todos: Map<string, TodoItem> = new Map(); 