import express from "express";
import auth from "../Middlewares/auth.js";
import loadMembership, {
  loadMembershipFromTask,
} from "../Middlewares/loadMembership.js";
import authorize from "../Middlewares/authorize.js";

import {
  createTask,
  updateTask,
  getTaskByTeam,
  deleteTask,
  updateTaskStatus,
  getMyTasks,
  getTasksOfUser,
  getTaskById,
  getTasksOfUserInTeam,
  getMyTasksInTeam,
} from "../Controllers/task.controller.js";

const router = express.Router();

router.post("/", auth, loadMembership, authorize("task:create"), createTask); // Done

// Static / multi-segment paths before /:teamId
router.get("/my/tasks", auth, getMyTasks); // done
router.get("/getTask/:taskId", auth, loadMembershipFromTask, getTaskById);
router.get("/user/:userId/tasks", auth, getTasksOfUser);
router.get(
  "/team/:teamId/user/:userId/tasks",
  auth,
  loadMembership,
  authorize("task:view:all"),
  getTasksOfUserInTeam,
); //done
router.get(
  "/:teamId/my-tasks",
  auth,
  loadMembership,
  // authorize("task:view:own"),
  getMyTasksInTeam,
);
router.get(
  "/:teamId",
  auth,
  loadMembership,
  authorize("task:view:all"),
  getTaskByTeam,
);

router.patch(
  "/:taskId/status",
  auth,
  loadMembershipFromTask,
  updateTaskStatus,
);
router.patch(
  "/:taskId",
  auth,
  loadMembershipFromTask,
  authorize("task:update"),
  updateTask,
);
router.delete(
  "/:taskId",
  auth,
  loadMembershipFromTask,
  authorize("task:delete"),
  deleteTask,
);

export default router;
