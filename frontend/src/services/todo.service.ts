import axios from "@/lib/axios";
import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoStats,
  TodoFilter,
  TodoSort,
} from "../types/todo.types";

export const todoService = {
  /**
   * Get all todos with optional filtering and sorting
   */
  async getTodos(filter?: TodoFilter, sortBy?: TodoSort): Promise<Todo[]> {
    const params = new URLSearchParams();

    if (filter && filter !== "all") {
      params.append("filter", filter);
    }

    if (sortBy) {
      params.append("sortBy", sortBy);
    }

    const response = await axios.get(`/todos?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get single todo by ID
   */
  async getTodo(id: string): Promise<Todo> {
    const response = await axios.get(`/todos/${id}`);
    return response.data.data;
  },

  /**
   * Create new todo
   */
  async createTodo(data: CreateTodoInput): Promise<Todo> {
    const response = await axios.post("/todos", data);
    return response.data.data;
  },

  /**
   * Update existing todo
   */
  async updateTodo(id: string, data: UpdateTodoInput): Promise<Todo> {
    const response = await axios.put(`/todos/${id}`, data);
    return response.data.data;
  },

  /**
   * Toggle todo completion status
   */
  async toggleTodo(id: string): Promise<Todo> {
    const response = await axios.patch(`/todos/${id}/toggle`);
    return response.data.data;
  },

  /**
   * Delete todo
   */
  async deleteTodo(id: string): Promise<void> {
    await axios.delete(`/todos/${id}`);
  },

  /**
   * Get todo statistics
   */
  async getStats(): Promise<TodoStats> {
    const response = await axios.get("/todos/stats");
    return response.data.data;
  },
};
