import express from "express"
import auth from "../Middlewares/auth.js"
import { isTeamAdmin } from "../Middlewares/adminOnly.js";
import {createTeam, getSingleTeam, removeMember, addMember, getMyTeams, updateTeamMemberRole} from "../Controllers/team.controller.js"

const router = express.Router();

router.post('/', auth, createTeam);
router.get('/:teamId', auth, getSingleTeam);
router.delete('/:teamId/members/:memberId', auth, isTeamAdmin, removeMember);
router.post('/:teamId/members', auth, isTeamAdmin, addMember);
router.get('/', auth, getMyTeams);
router.post('/:teamId/members/:memberId', auth, isTeamAdmin, updateTeamMemberRole);

export default router;