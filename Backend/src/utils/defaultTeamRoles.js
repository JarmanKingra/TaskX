import Permissions from "../Models/permissions.js";
import Role from "../Models/role.js";

const MEMBER_PERMISSION_NAMES = ["task:view:own"];

export const createDefaultTeamRoles = async (teamId) => {
  const allPermissions = await Permissions.find().select("_id name");
  const allPermissionIds = allPermissions.map((p) => p._id);
  const memberPermissionIds = allPermissions
    .filter((p) => MEMBER_PERMISSION_NAMES.includes(p.name))
    .map((p) => p._id);

  const [ownerRole, memberRole] = await Role.create([
    {
      name: "Owner",
      description: "Full access to the team",
      team: teamId,
      permissions: allPermissionIds,
    },
    {
      name: "Member",
      description: "Basic member access",
      team: teamId,
      permissions: memberPermissionIds,
    },
  ]);

  return { ownerRole, memberRole };
};

export const getOrCreateMemberRole = async (teamId) => {
  let memberRole = await Role.findOne({ team: teamId, name: "Member" });

  if (memberRole) {
    return memberRole;
  }

  const allPermissions = await Permissions.find().select("_id name");
  const memberPermissionIds = allPermissions
    .filter((p) => MEMBER_PERMISSION_NAMES.includes(p.name))
    .map((p) => p._id);

  memberRole = await Role.create({
    name: "Member",
    description: "Basic member access",
    team: teamId,
    permissions: memberPermissionIds,
  });

  return memberRole;
};
