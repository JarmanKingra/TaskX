import Task from "../Models/tasks.js";
import Team from "../Models/teams.js";

const createTask = async (req, res) => {
  try {
    const { title, description, deadline, assignedTo, team } = req.body;

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

    const allowedFields = [
      "title",
      "description",
      "deadline",
      "status",
      "assignedTo",
    ];
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
      return res.status(403).json({ message: "You are not the admin of this team" });
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

    return res.status(200).json({
      message: "Task status updated successfully",
      task,
    });

  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export { createTask, updateTask, getTaskByTeam, deleteTask, updateTaskStatus, getMyTasks, getTasksOfUser };
