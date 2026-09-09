import mongoose from "mongoose";
import Permissions from "../Models/permissions.js";
import Role from "../Models/role.js";
import Team from "../Models/teams.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const resolvePermissionIds = async (permissionRefs = []) => {
  if (!Array.isArray(permissionRefs)) {
    return { error: "permissions must be an array" };
  }

  if (permissionRefs.length === 0) {
    return { ids: [] };
  }

  const ids = permissionRefs.filter(isValidObjectId);
  const names = permissionRefs.filter((ref) => !isValidObjectId(ref));

  const found = await Permissions.find({
    $or: [
      ...(ids.length ? [{ _id: { $in: ids } }] : []),
      ...(names.length ? [{ name: { $in: names } }] : []),
    ],
  });

  if (found.length !== new Set(permissionRefs.map(String)).size) {
    return { error: "One or more permissions are invalid" };
  }

  return { ids: found.map((p) => p._id) };
};

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permissions.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      permissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTeamRoles = async (req, res) => {
  try {
    const { teamId } = req.params;

    const roles = await Role.find({ team: teamId })
      .populate("permissions", "name description")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { teamId, roleId } = req.params;

    const role = await Role.findOne({ _id: roleId, team: teamId }).populate(
      "permissions",
      "name description",
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, description = "", permissions = [] } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const resolved = await resolvePermissionIds(permissions);
    if (resolved.error) {
      return res.status(400).json({
        success: false,
        message: resolved.error,
      });
    }

    const role = await Role.create({
      name: name.trim(),
      description,
      team: teamId,
      permissions: resolved.ids,
    });

    await role.populate("permissions", "name description");

    return res.status(201).json({
      success: true,
      message: "Role created successfully for this team",
      role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A role with this name already exists in the team",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { teamId, roleId } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findOne({ _id: roleId, team: teamId });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    if (name !== undefined) {
      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: "Role name cannot be empty",
        });
      }
      role.name = name.trim();
    }

    if (description !== undefined) {
      role.description = description;
    }

    if (permissions !== undefined) {
      const resolved = await resolvePermissionIds(permissions);
      if (resolved.error) {
        return res.status(400).json({
          success: false,
          message: resolved.error,
        });
      }
      role.permissions = resolved.ids;
    }

    await role.save();
    await role.populate("permissions", "name description");

    return res.status(200).json({
      success: true,
      role,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A role with this name already exists in the team",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { teamId, roleId } = req.params;

    const role = await Role.findOne({ _id: roleId, team: teamId });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    const team = await Team.findById(teamId);
    const inUse = team?.members?.some(
      (member) => member.role?.toString() === roleId,
    );

    if (inUse) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a role that is assigned to members",
      });
    }

    await role.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const { roleId } = req.body;

    if (!roleId || !isValidObjectId(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Valid roleId is required",
      });
    }

    const role = await Role.findOne({ _id: roleId, team: teamId });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found for this team",
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    if (team.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Cannot change the team owner's role",
      });
    }

    const member = team.members.find(
      (m) => m.user.toString() === memberId,
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User is not a member of this team",
      });
    }

    member.role = roleId;
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAllPermissions,
  getTeamRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  updateMemberRole,
};
