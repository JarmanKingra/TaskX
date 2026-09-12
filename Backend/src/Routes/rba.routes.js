import express from "express";
import auth from "../Middlewares/auth.js";
import loadMembership from "../Middlewares/loadMembership.js";
import authorize from "../Middlewares/authorize.js";
import {
  getAllPermissions,
  getTeamRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  updateMemberRole,
} from "../Controllers/rba.controller.js";

const router = express.Router();

// Global permission catalog (seeded)
router.get("/permissions", auth, getAllPermissions);

// Team roles
router.get("/teams/:teamId/roles", auth, loadMembership, getTeamRoles); // done
router.get(
  "/teams/:teamId/roles/:roleId",
  auth,
  loadMembership,
  getRoleById,
); //done
router.post(
  "/teams/:teamId/roles",
  auth,
  loadMembership,
  authorize("role:manage"),
  createRole,
); //done

router.put(
  "/teams/:teamId/roles/:roleId",
  auth,
  loadMembership,
  authorize("role:manage"),
  updateRole,
); //done
router.delete(
  "/teams/:teamId/roles/:roleId",
  auth,
  loadMembership,
  authorize("role:manage"),
  deleteRole,
); // done

// Assign a role to a team member
router.put(
  "/teams/:teamId/members/:memberId/role",
  auth,
  loadMembership,
  authorize("member:role:update"),
  updateMemberRole,
); //done

export default router;
