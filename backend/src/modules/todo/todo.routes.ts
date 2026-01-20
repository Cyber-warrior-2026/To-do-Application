import express from 'express';
import { verifyToken } from '../../middleware/auth.middleware';
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
router.use(verifyToken);
// TEMPORARY: Mock user object for testing
// router.use((req: any, res, next) => {
//   req.user = {
//     id: '507f1f77bcf86cd799439011'  // ✅ Changed from req.userId to req.user.id
//   };
//   next();
// });

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
