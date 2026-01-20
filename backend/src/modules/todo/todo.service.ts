import Todo, { ITodo } from './todo.model';
import mongoose from 'mongoose';

export class TodoService {
  // Get all todos for a user with filtering
  async getUserTodos(
    userId: string,
    filter?: 'active' | 'completed' | 'all',
    sortBy: 'createdAt' | 'dueDate' | 'priority' = 'createdAt'
  ): Promise<ITodo[]> {
    let query: any = { userId: new mongoose.Types.ObjectId(userId) };

    // Apply filter
    if (filter === 'active') {
      query.completed = false;
    } else if (filter === 'completed') {
      query.completed = true;
    }

    // Build sort object
    let sortObject: any = {};
    if (sortBy === 'createdAt') {
      sortObject.createdAt = -1;
    } else if (sortBy === 'dueDate') {
      sortObject.dueDate = 1;
      sortObject.createdAt = -1;
    } else if (sortBy === 'priority') {
      // Custom priority sorting: high -> medium -> low

      sortObject.createdAt = -1;
    }

    let todos = await Todo.find(query).sort(sortObject);
      if (sortBy === 'priority') {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      todos = todos.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    }
    return todos;
  }

  // Get single todo by ID
  async getTodoById(todoId: string, userId: string): Promise<ITodo | null> {
    const todo = await Todo.findOne({
      _id: todoId,
      userId: new mongoose.Types.ObjectId(userId)
    });
    return todo;
  }

  // Create new todo
  async createTodo(
    todoData: {
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      dueDate?: Date;
    },
    userId: string
  ): Promise<ITodo> {
    const todo = await Todo.create({
      ...todoData,
      userId: new mongoose.Types.ObjectId(userId)
    });
    return todo;
  }

  // Update todo
  async updateTodo(
    todoId: string,
    userId: string,
    updateData: Partial<ITodo>
  ): Promise<ITodo | null> {
    const todo = await Todo.findOneAndUpdate(
      {
        _id: todoId,
        userId: new mongoose.Types.ObjectId(userId)
      },
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    return todo;
  }

  // Toggle todo completion
  async toggleTodo(todoId: string, userId: string): Promise<ITodo | null> {
    const todo = await Todo.findOne({
      _id: todoId,
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!todo) {
      return null;
    }

    todo.completed = !todo.completed;
    await todo.save();
    return todo;
  }

  // Delete todo
  async deleteTodo(todoId: string, userId: string): Promise<ITodo | null> {
    const todo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: new mongoose.Types.ObjectId(userId)
    });
    return todo;
  }

  // Get todo statistics
  async getTodoStats(userId: string): Promise<{
    total: number;
    completed: number;
    active: number;
    highPriority: number;
  }> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [total, completed, highPriority] = await Promise.all([
      Todo.countDocuments({ userId: userObjectId }),
      Todo.countDocuments({ userId: userObjectId, completed: true }),
      Todo.countDocuments({ userId: userObjectId, priority: 'high', completed: false })
    ]);

    return {
      total,
      completed,
      active: total - completed,
      highPriority
    };
  }
}
