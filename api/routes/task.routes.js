// Import Express framework and create a new Router object
const express = require("express");
const router = express.Router();

// Import the User model for interacting with the MongoDB users collection
const taskSchema = require(`../models/task.model`);
// Import authorization middleware to protect routes
const authorize = require("../utils/middlewares/auth.middleware")

//GET ALL - Tasks
router.get('/', authorize, async (req, res, next) => {
    try {
        // Fetch all tasks from the database, population client data
        const tasks = await taskSchema.find().populate('client');
        res.status(200).json(tasks);
    } catch (error) {
        // Forward any errors to the global error handler
        next(error);
    }
});

// GET BY ID - Tasks
router.get('/task/:id', authorize, async (req, res, next) => {
    try {
        // Find task by ID
        const task = await taskSchema.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "SERVER: Task not found." });
        }
        // Return the found task as JSON
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
});

//GET BY NAME - Tasks
router.get('/task/:clientName', authorize, async (req, res, next) => {
    try {
        const clientName = req.params.name;

        // Use the 'aggregate' method to perform advanced query operations
        const tasksByClient = await taskSchema.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'clientDetails'
                }
            },
            {
                $match: {
                    'clientDetails.name': clientName // Filter tasks by the client's name
                }
            }
        ]);

        // If no tasks are found, return a 404 response
        if (tasksByClient.length === 0) {
            return res.status(404).json({ message: "SERVER: No tasks found" });
        }

        // Return the found tasks as JSON
        res.status(200).json(tasksByClient);
    } catch (error) {
        // Handle errors
        next(error);
    }
});

//CREATE Task
router.post('/create', authorize, async (req, res, next) => {
    try {
        // Save the task
        const task = new taskSchema({
            client: req.body.client,
            dateStart: req.body.dateStart,
            dateEnd: req.body.dateEnd,
            description: req.body.description,
        });
        const createdTask = await task.save();
        return res.status(201).json({
            message: "SUCCESS: Task created successfully.",
            result: createdTask
        });
    } catch (error) {
        return next(error);
    }
});

// UPDATE Task by ID
router.put('/edit/:id', authorize, async (req, res, next) => {
    try {
        // Update Task details
        const updatedTask = await taskSchema.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: "ERROR: Task not found." });
        }

        // Return the updated Task as JSON
        res.status(200).json({
            message: "SUCCESS: Task updated successfully.",
            result: updatedTask
        });
    } catch (error) {
        // Forward any errors to the global error handler
        next(error);
    }
});

// DELETE Task by ID
router.delete('/delete/:id', authorize, async (req, res, next) => {
    try {
        // Find and delete the task by ID
        const deletedTask = await taskSchema.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "ERROR: Task not found." });
        }
        // Return the deleted user as JSON
        res.status(200).json({
            message: "SUCCESS: Task deleted successfully.",
            result: deletedTask
        });
    } catch (error) {
        // Forward any errors to the global error handler
        next(error);
    }
});

module.exports = router;