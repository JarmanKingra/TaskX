import Task from "../Models/tasks.js";
import Message from "../Models/message.js";

const createMessage = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { message } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (req.user.role != "user") {
      return res.status(401).json({
        message: "Only users are allowed to send messages",
      });
    }

    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only assigned user can comment on this task" });
    }

    await Message.create({
      task: taskId,
      sender: req.user._id,
      message,
    });
    return res.status(200).json({ message: "Message created successfully" });
  } catch (error) {
    console.error("MESSAGE ERROR OF CREATE MESSAGE:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createMessage };
