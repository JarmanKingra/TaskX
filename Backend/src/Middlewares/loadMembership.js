import Team from "../Models/teams.js";
import Role from "../Models/role.js";

const loadMembership = async (req, res, next) => {
  try {
    const teamId = req.params.teamId || req.body.teamId || req.query.teamId;

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

    const member = team.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!member) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this team.",
      });
    }

    const role = await Role.findById(member.role).populate("permissions");

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    req.team = team;
    req.membership = {
      role,
      permissions: role.permissions,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default loadMembership;
