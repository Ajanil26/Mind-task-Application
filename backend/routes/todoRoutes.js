const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Log middleware for debugging
router.use((req, res, next) => {
  console.log('Todo Route:', req.method, req.path);
  console.log('User ID:', req.userId);
  next();
});

// Routes
router.get('/', todoController.getAllTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

router.get('/date/:date', todoController.getTodosByDate);
router.get('/priority/:priority', todoController.getTodosByPriority);
router.get('/stats', todoController.getTodoStats);

module.exports = router; 