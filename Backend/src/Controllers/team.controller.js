import Team from "../Models/teams.js";

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

    const isMember = team.members.includes(memberId);

    if (!isMember) {
      return res.status(400).json({ message: "User is not a member of this team" });
    }

    await Team.findByIdAndUpdate(
      teamId,
      {
        $pull: { members: memberId }
      },
      { new: true }
    );

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
    const { teamId, memberId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isAlreadyMember = team.members.includes(memberId);

    if (isAlreadyMember) {
      return res.status(200).json({ message: "User is already a member of the team" });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate("members", "fullName email");

    return res.status(200).json({
      message: "Member added successfully",
      team: updatedTeam,
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export { createTeam, getAllTeams, getSingleTeam, addMember, removeMember };
