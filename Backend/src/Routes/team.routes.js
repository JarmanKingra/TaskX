import express from "express";
import auth from "../Middlewares/auth.js";
import loadMembership from "../Middlewares/loadMembership.js";
import authorize from "../Middlewares/authorize.js";
import {
  createTeam,
  getSingleTeam,
  removeMember,
  addMember,
  getMyTeams,
} from "../Controllers/team.controller.js";

const router = express.Router();

router.post("/", auth, createTeam);
router.get("/", auth, getMyTeams);
router.get("/:teamId", auth, loadMembership, getSingleTeam);
router.post(
  "/:teamId/members",
  auth,
  loadMembership,
  authorize("member:add"),
  addMember,
);
router.delete(
  "/:teamId/members/:memberId",
  auth,
  loadMembership,
  authorize("member:remove"),
  removeMember,
);

export default router;
