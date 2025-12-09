import express from "express"
import auth from "../Middlewares/auth.js"
import { createMessage } from "../Controllers/message.controller.js";

const router = express.Router();

router.post("/:taskId", auth, createMessage);

export default router;