import * as todo from "./todo";

/**
 * A collection of tools used in the Mastra application.
 *
 * @property addTodoTool - A tool for adding new todo items.
 * @property updateTodoTool - A tool for updating existing todo items.
 * @property deleteTodoTool - A tool for deleting todo items.
 * @property listTodosTool - A tool for listing all todo items.
 */
export const tools = {
  addTodoTool: todo.addTodoTool,
  updateTodoTool: todo.updateTodoTool,
  deleteTodoTool: todo.deleteTodoTool,
  listTodosTool: todo.listTodosTool
};
