import Task from "../Models/tasks.js";
import Team from "../Models/teams.js";
import User from "../Models/user.js";

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const adminId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }
    const existing = await Team.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const newTeam = await Team.create({
      name,
      admin: adminId,
      members: [adminId],
    });

    res.status(201).json({
      success: true,
      team: newTeam,
    });
  } catch (err) {
    console.error("Create Team Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const adminId = req.user._id;

    const allTeams = await Team.find({ admin: adminId })
      .populate("admin", "name email")
      .populate("members", "name email")
      .populate("tasks");

    return res.json(allTeams);
  } catch (error) {
    console.error("TEAM ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSingleTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId)
      .populate("admin", "name email")
      .populate("members", "fullName email")
      .populate("tasks");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    return res.json(team);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not the admin of this team",
      });
    }

    if (team.admin.toString() === memberId) {
      return res.status(400).json({
        message: "Admin cannot remove himself from the team",
      });
    }

    const isMember = team.members.some(
      id => id.toString() === memberId
    );

    if (!isMember) {
      return res.status(400).json({ message: "User is not a member of this team" });
    }

    await Task.updateMany(
      { team: teamId, assignedTo: memberId },
      { assignedTo: null }
    );
    
    team.members.pull(memberId);
    await team.save();

    return res.status(200).json({
      message: "Member removed successfully",
    });

  } catch (error) {
    console.error("Remove Member Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const addMember = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { email } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only admin can add members",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isAlreadyMember = team.members.some(
      (id) => id.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        message: "User already a member of this team",
      });
    }

    team.members.push(user._id);
    await team.save();

    return res.status(200).json({
      message: "Member added successfully",
      member: user,
    });

  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



export { createTeam, getAllTeams, getSingleTeam, addMember, removeMember };
