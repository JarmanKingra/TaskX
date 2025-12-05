import express from "express"
import auth from "../Middlewares/auth.js"
import { isAdmin } from "../Middlewares/adminOnly.js";
import {createTeam, getSingleTeam, getAllTeams, removeMember, addMember} from "../Controllers/team.controller.js"

const router = express.Router();

router.post('/', auth, isAdmin, createTeam);
router.get('/:teamId', auth, isAdmin, getSingleTeam);
router.get('/', auth, isAdmin, getAllTeams);
router.delete('/:teamId/members/:memberId', auth, isAdmin, removeMember);
router.post('/:teamId/members/:memberId', auth, isAdmin, addMember);

export default router;