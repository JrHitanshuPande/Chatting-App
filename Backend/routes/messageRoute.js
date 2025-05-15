import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendMessage, getMessage } from "../controllers/messageController.js";
const router = Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/get", authMiddleware, getMessage);

export default router;