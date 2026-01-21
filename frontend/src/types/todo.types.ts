export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  highPriority: number;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'createdAt' | 'dueDate' | 'priority';
