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

router.post("/", auth, createTeam); // done
router.get("/", auth, getMyTeams);   // done
router.get("/:teamId", auth, loadMembership, getSingleTeam); //done
router.post(
  "/:teamId/members",
  auth,
  loadMembership,
  authorize("member:add"),
  addMember,
); //done
router.delete(
  "/:teamId/members/:memberId",
  auth,
  loadMembership,
  authorize("member:remove"),
  removeMember,
); // done

export default router;
