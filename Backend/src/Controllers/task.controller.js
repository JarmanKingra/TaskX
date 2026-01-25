import Task from "../Models/tasks.js";
import Team from "../Models/teams.js";
import User from "../Models/user.js";

const createTask = async (req, res) => {
  console.log("🔥 CREATE TASK CONTROLLER HIT");
  try {
    const { title, description, deadline, assignedTo, team } = req.body;

    console.log("REQ BODY:", {
      title,
      description,
      deadline,
      assignedTo,
      team,
    });

    if (!title || !team || !description || !assignedTo) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const existingTeam = await Team.findById(team);

    if (!existingTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (existingTeam.admin.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to create task for this team" });
    }

    const isAdmin = existingTeam.admin.toString() === assignedTo;
    const isMember = existingTeam.members.some(
      (member) => member.user.toString() === assignedTo
    )

    if (!isAdmin && !isMember) {
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
    const { taskId } = req.params;
    const newTaskData = req.body;

    const task = await Task.findById(taskId);

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
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await Task.findById(taskId)
      .populate("assignedBy", "fullName email")
      .populate("assignedTo", "fullName email")
      .populate("team", "name admin");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    const isAssignedUser = task.assignedTo._id.toString() === userId.toString();
    const isTeamAdmin = task.team.admin.toString() === userId.toString();

    if (!isAssignedUser && !isTeamAdmin) {
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

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findById(userId).select("fullName email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not allowed to view member tasks",
      });
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

    const isTeam = await Team.findById(teamId);
    if (!isTeam) {
      return res.status(404).json({ message: "Team not found" });
    }

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
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("team");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.team.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not the admin of this team" });
    }

    const deletedTask = await task.deleteOne();
    return res.status(200).json(deletedTask);
  } catch (error) {
    console.error("TASK ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    const task = await Task.findById(taskId);
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

    const updatedTask = await Task.findByIdAndUpdate(taskId)
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
