import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { TodoService } from './todo.service';

const todoService = new TodoService();

// @desc    Get all todos for logged-in user
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const filter = req.query.filter as 'active' | 'completed' | 'all' | undefined;
    const sortBy = req.query.sortBy as 'createdAt' | 'dueDate' | 'priority' | undefined;

    const todos = await todoService.getUserTodos(userId, filter, sortBy);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
export const getTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;

    const todo = await todoService.getTodoById(todoId, userId);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({
        success: false,
        message: 'Title is required'
      });
      return;
    }

    const todo = await todoService.createTodo(
      { title, description, priority, dueDate },
      userId
    );

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;

    const todo = await todoService.updateTodo(todoId, userId, req.body);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
export const toggleTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;

    const todo = await todoService.toggleTodo(todoId, userId);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to toggle todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const todoId = req.params.id;

    const todo = await todoService.deleteTodo(todoId, userId);

    if (!todo) {
      res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
export const getTodoStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const stats = await todoService.getTodoStats(userId);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
