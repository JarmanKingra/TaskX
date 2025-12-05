import express from "express";
const router = express.Router();
import { register, login } from "../Controllers/user.controller.js";


router.post('/signup', register);
router.post('/login', login);

export default router;