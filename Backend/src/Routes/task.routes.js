import express from "express"
import auth from "../Middlewares/auth.js"
import { isTeamAdmin } from "../Middlewares/adminOnly.js";

import { createTask, updateTask, getTaskByTeam, deleteTask, updateTaskStatus, getMyTasks, getTasksOfUser, getTaskById, getTasksOfUserInTeam, getMyTasksInTeam } from "../Controllers/task.controller.js"

const router = express.Router();

router.post('/', auth, createTask);
router.patch('/:taskId', auth, isTeamAdmin, updateTask);
router.get('/:teamId', auth, isTeamAdmin, getTaskByTeam);
router.delete('/:taskId', auth, deleteTask);
router.patch('/:taskId/status', auth, updateTaskStatus);
router.get('/my/tasks', auth, getMyTasks);
router.get('/:teamId/my-tasks', auth, getMyTasksInTeam);
router.get('/user/:userId/tasks', auth, isTeamAdmin, getTasksOfUser);
router.get('/getTask/:taskId', auth, getTaskById);
router.get('/team/:teamId/user/:userId/tasks', auth, isTeamAdmin, getTasksOfUserInTeam);

export default router;