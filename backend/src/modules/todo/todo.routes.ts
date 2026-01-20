import express from 'express';
import { protect } from '../../middleware/auth';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  getTodoStats
} from './todo.controller';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Stats route (must be before /:id)
router.get('/stats', getTodoStats);

// Main CRUD routes
router.route('/')
  .get(getTodos)
  .post(createTodo);

// Toggle route (before /:id)
router.patch('/:id/toggle', toggleTodo);

// ID-based routes
router.route('/:id')
  .get(getTodo)
  .put(updateTodo)
  .delete(deleteTodo);

export default router;
