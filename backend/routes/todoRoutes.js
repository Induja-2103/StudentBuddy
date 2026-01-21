const express = require('express');
const router = express.Router();
const { protect, checkStudent } = require('../middleware/authMiddleware');
const Todo = require('../models/Todo');

// @route   GET /api/todo
// @desc    Get all todos for user
// @access  Private (Student)
router.get('/', protect, checkStudent, async (req, res) => {
    try {
        const { completed } = req.query;

        const query = { user_id: req.user._id };
        if (completed !== undefined) {
            query.is_completed = completed === 'true';
        }

        const todos = await Todo.find(query).sort({ due_date: 1, priority: -1 });

        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   POST /api/todo
// @desc    Create new todo
// @access  Private (Student)
router.post('/', protect, checkStudent, async (req, res) => {
    try {
        const todo = await Todo.create({
            user_id: req.user._id,
            ...req.body
        });

        res.status(201).json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/todo/:id
// @desc    Update todo
// @access  Private (Student)
router.put('/:id', protect, checkStudent, async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   PUT /api/todo/:id/toggle
// @desc    Toggle todo completion
// @access  Private (Student)
router.put('/:id/toggle', protect, checkStudent, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user_id: req.user._id });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.is_completed = !todo.is_completed;
        todo.completed_at = todo.is_completed ? new Date() : null;
        await todo.save();

        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   DELETE /api/todo/:id
// @desc    Delete todo
// @access  Private (Student)
router.delete('/:id', protect, checkStudent, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id
        });

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
