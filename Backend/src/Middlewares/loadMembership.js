import Team from "../Models/teams.js";
import Role from "../Models/role.js";
import Permissions from "../Models/permissions.js";
import Task from "../Models/tasks.js";

const resolveTeamId = (req) =>
  req.params.teamId || req.body.teamId || req.body.team || req.query.teamId;

const attachMembership = async (req, team, userId) => {
  const isOwner = team.owner.toString() === userId.toString();

  const member = team.members.find(
    (m) => m.user.toString() === userId.toString(),
  );

  if (!isOwner && !member) {
    return {
      error: {
        status: 403,
        message: "You are not a member of this team.",
      },
    };
  }

  // Owner always has every permission in the catalog
  if (isOwner) {
    const allPermissions = await Permissions.find().sort({ name: 1 });
    let role = null;

    if (member?.role) {
      role = await Role.findById(member.role).populate("permissions");
    }

    req.team = team;
    req.membership = {
      isOwner: true,
      role,
      permissions: allPermissions,
    };

    return { ok: true };
  }

  const role = await Role.findById(member.role).populate("permissions");

  if (!role) {
    return {
      error: {
        status: 404,
        message: "Role not found",
      },
    };
  }

  req.team = team;
  req.membership = {
    isOwner: false,
    role,
    permissions: role.permissions,
  };

  return { ok: true };
};

const loadMembership = async (req, res, next) => {
  try {
    const teamId = resolveTeamId(req);

    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: "Team ID is required",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    const result = await attachMembership(req, team, req.user._id);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const loadMembershipFromTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const team = await Team.findById(task.team);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    req.task = task;

    const result = await attachMembership(req, team, req.user._id);

    if (result.error) {
      return res.status(result.error.status).json({
        success: false,
        message: result.error.message,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { loadMembershipFromTask };
export default loadMembership;
