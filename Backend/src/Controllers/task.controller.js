import Task from "../Models/tasks.js";
import User from "../Models/user.js";

const hasPermission = (membership, permissionName) => {
  if (membership?.isOwner) return true;
  return (membership?.permissions || []).some((p) => p.name === permissionName);
};

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedTo, team } = req.body;
    const existingTeam = req.team;

    if (!title || !team || !description || !assignedTo) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (!existingTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isOwner = existingTeam.owner.toString() === assignedTo;
    const isMember = existingTeam.members.some(
      (member) => member.user.toString() === assignedTo,
    );

    if (!isOwner && !isMember) {
      return res.status(400).json({
        message: "Assigned user is not part of this team",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      deadline,
      assignedBy: req.user._id,
      assignedTo,
      team,
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = req.task;
    const newTaskData = req.body;

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const allowedFields = ["title", "description", "deadline", "assignedTo"];
    allowedFields.forEach((field) => {
      if (newTaskData[field] !== undefined) {
        task[field] = newTaskData[field];
      }
    });

    await task.save();
    return res.status(200).json(task);
  } catch (error) {
    console.error("Update TASK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const userId = req.user._id;
    const task = await Task.findById(req.params.taskId)
      .populate("assignedBy", "fullName email")
      .populate("assignedTo", "fullName email")
      .populate("team", "name owner");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isAssignedUser =
      task.assignedTo._id.toString() === userId.toString();
    const canViewAll = hasPermission(req.membership, "task:view:all");
    const canViewOwn =
      hasPermission(req.membership, "task:view:own") && isAssignedUser;

    if (!canViewAll && !canViewOwn) {
      return res.status(403).json({
        message: "You are not allowed to view this task",
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    console.error("GET TASK BY ID ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getTasksOfUserInTeam = async (req, res) => {
  try {
    const { teamId, userId } = req.params;

    const user = await User.findById(userId).select("fullName email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({
      team: teamId,
      assignedTo: userId,
    }).populate("assignedBy", "fullName email");

    return res.status(200).json({
      user,
      tasks,
    });
  } catch (error) {
    console.error("USER TEAM TASK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTaskByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const allTasks = await Task.find({ team: teamId })
      .populate("assignedBy", "fullName email")
      .populate("assignedTo", "fullName email")
      .populate("team", "name");

    return res.status(200).json(allTasks);
  } catch (error) {
    console.error("ALL TASK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    const tasks = await Task.find({ assignedTo: userId })
      .populate("team", "title")
      .populate("assignedBy", "name email");

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyTasksInTeam = async (req, res) => {
  try {
    const userId = req.user._id;
    const teamId = req.params.teamId;

    const tasks = await Task.find({
      assignedTo: userId,
      team: teamId,
    })
      .populate("team", "title")
      .populate("assignedBy", "name email");

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("GET MY TASKS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTasksOfUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await Task.find({ assignedTo: userId })
      .populate("team", "title")
      .populate("assignedBy", "name email");

    return res.status(200).json(tasks);
  } catch (error) {
    console.error("GET USER TASKS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = req.task;

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deletedTask = await task.deleteOne();
    return res.status(200).json(deletedTask);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const task = req.task;

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only the assigned user can update the task status",
      });
    }

    const allowed = ["pending", "in-progress", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedBy", "fullName")
      .populate("team", "name");

    return res.status(200).json({
      message: "Task status updated successfully",
      updatedTask,
    });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export {
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
};
