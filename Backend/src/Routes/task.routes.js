import express from "express"
import auth from "../Middlewares/auth.js"
import { isAdmin } from "../Middlewares/adminOnly.js";

import { createTask, updateTask, getTaskByTeam, deleteTask, updateTaskStatus, getMyTasks, getTasksOfUser } from "../Controllers/task.controller.js"

const router = express.Router();

router.post('/', auth, isAdmin, createTask);
router.patch('/:taskId', auth, isAdmin, updateTask);
router.get('/:teamId', auth, isAdmin, getTaskByTeam);
router.delete('/:taskId', auth, isAdmin, deleteTask);
router.patch('/:taskId/status', auth, updateTaskStatus);
router.get('/my/tasks', auth, getMyTasks);
router.get('/user/:userId/tasks', auth, isAdmin, getTasksOfUser);

export default router;