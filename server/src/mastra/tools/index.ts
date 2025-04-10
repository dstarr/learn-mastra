import { addTodoTool, updateTodoTool, deleteTodoTool, listTodosTool } from "./todo";
import { weatherTool } from "./weather";

/**
 * A collection of tools used in the Mastra application.
 *
 * @property weatherTool - A tool for retrieving weather information.
 * @property addTodoTool - A tool for adding new todo items.
 * @property updateTodoTool - A tool for updating existing todo items.
 * @property deleteTodoTool - A tool for deleting todo items.
 * @property listTodosTool - A tool for listing all todo items.
 */
export const tools = {
  weatherTool,
  addTodoTool,
  updateTodoTool,
  deleteTodoTool,
  listTodosTool
};
