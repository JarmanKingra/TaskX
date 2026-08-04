import Task from "../Models/tasks.js";
import Team from "../Models/teams.js";
import User from "../Models/user.js";
import Role from "../Models/role.js";
import {
  createDefaultTeamRoles,
  getOrCreateMemberRole,
} from "../utils/defaultTeamRoles.js";

const createTeam = async (req, res) => {
  try {
    const { name } = req.body;
    const ownerId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const newTeam = await Team.create({
      name,
      owner: ownerId,
      members: [],
    });

    const { ownerRole } = await createDefaultTeamRoles(newTeam._id);

    newTeam.members.push({
      user: ownerId,
      role: ownerRole._id,
    });
    await newTeam.save();

    await newTeam.populate([
      { path: "owner", select: "fullName email" },
      { path: "members.user", select: "fullName email" },
      { path: "members.role", select: "name description permissions" },
    ]);

    res.status(201).json({
      success: true,
      team: newTeam,
    });
  } catch (err) {
    console.error("Create Team Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user._id;

    const allTeams = await Team.find({
      $or: [{ owner: userId }, { "members.user": userId }],
    })
      .populate("owner", "fullName email")
      .populate("members.user", "fullName email")
      .populate("members.role", "name description");

    return res.status(200).json(allTeams);
  } catch (error) {
    console.error("TEAM ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getSingleTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    const team = await Team.findById(teamId)
      .populate("owner", "fullName email")
      .populate("members.user", "fullName email")
      .populate("members.role", "name description permissions")
      .populate("tasks");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isOwner = team.owner._id.toString() === req.user._id.toString();
    const member = team.members.find(
      (m) => m.user._id.toString() === req.user._id.toString(),
    );

    if (!isOwner && !member) {
      return res.status(403).json({
        message: "You are not a member of this team.",
      });
    }

    return res.json({
      team,
      role: isOwner ? "owner" : member?.role,
      membership: req.membership
        ? {
            isOwner: req.membership.isOwner,
            role: req.membership.role,
            permissions: req.membership.permissions,
          }
        : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const removeMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const team = req.team || (await Team.findById(teamId));

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.owner.toString() === memberId) {
      return res.status(400).json({
        message: "Cannot remove the team owner",
      });
    }

    const isMember = team.members.some((m) => m.user.toString() === memberId);

    if (!isMember) {
      return res
        .status(400)
        .json({ message: "User is not a member of this team" });
    }

    await Task.updateMany(
      { team: teamId, assignedTo: memberId },
      { assignedTo: null },
    );

    team.members = team.members.filter((m) => m.user.toString() !== memberId);
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
    const { email, roleId } = req.body;
    const team = req.team || (await Team.findById(teamId));

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isAlreadyMember = team.members.some(
      (m) => m.user.toString() === user._id.toString(),
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        message: "User already a member of this team",
      });
    }

    let roleToAssign = null;

    if (roleId) {
      roleToAssign = await Role.findOne({ _id: roleId, team: teamId });
      if (!roleToAssign) {
        return res.status(400).json({
          message: "Invalid role for this team",
        });
      }
    } else {
      roleToAssign = await getOrCreateMemberRole(teamId);
    }

    team.members.push({
      user: user._id,
      role: roleToAssign._id,
    });
    await team.save();
    await team.populate([
      { path: "members.user", select: "fullName email" },
      { path: "members.role", select: "name description" },
    ]);

    const newMember = team.members.at(-1);

    return res.status(200).json({
      message: "Member added successfully",
      member: newMember,
    });
  } catch (error) {
    console.error("Add Member Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export { createTeam, getSingleTeam, addMember, removeMember, getMyTeams };
