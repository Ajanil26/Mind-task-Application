const Todo = require('../models/Todo');

// Get all todos
exports.getAllTodos = async (req, res) => {
  try {
    console.log('Getting todos for user:', req.userId);
    const todos = await Todo.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    console.log('Found todos:', todos);
    res.json(todos);
  } catch (error) {
    console.error('Error in getAllTodos:', error);
    res.status(500).json({ 
      message: 'Error fetching todos',
      error: error.message 
    });
  }
};

// Create todo
exports.createTodo = async (req, res) => {
  try {
    console.log('Creating todo. User ID:', req.userId);
    console.log('Todo data:', req.body);

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todoData = {
      title: req.body.title,
      description: req.body.description || '',
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate,
      userId: req.userId,
      status: 'pending'
    };

    const todo = new Todo(todoData);
    const savedTodo = await todo.save();
    console.log('Todo created successfully:', savedTodo);
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error in createTodo:', error);
    res.status(500).json({ 
      message: 'Error creating todo',
      error: error.message 
    });
  }
};

// Update todo
exports.updateTodo = async (req, res) => {
  try {
    console.log('Updating todo:', req.params.id);
    console.log('Update data:', req.body);

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!todo) {
      console.log('Todo not found');
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Todo updated successfully:', todo);
    res.json(todo);
  } catch (error) {
    console.error('Error in updateTodo:', error);
    res.status(500).json({ 
      message: 'Error updating todo',
      error: error.message 
    });
  }
};

// Delete todo
exports.deleteTodo = async (req, res) => {
  try {
    console.log('Deleting todo:', req.params.id);

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!todo) {
      console.log('Todo not found');
      return res.status(404).json({ message: 'Todo not found' });
    }

    console.log('Todo deleted successfully');
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTodo:', error);
    res.status(500).json({ 
      message: 'Error deleting todo',
      error: error.message 
    });
  }
};

// Get todos by date
exports.getTodosByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const todos = await Todo.find({
      userId: req.userId,
      dueDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos by date' });
  }
};

// Get todos by priority
exports.getTodosByPriority = async (req, res) => {
  try {
    const todos = await Todo.find({
      userId: req.userId,
      priority: req.params.priority
    }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos by priority' });
  }
};

// Get todo statistics
exports.getTodoStats = async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { userId: req.userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      highPriority: 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todo statistics' });
  }
}; 