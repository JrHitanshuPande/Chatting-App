import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {userDetail, updateUser, getAllUser} from "../controllers/userController.js";
import multer from "../middleware/userMulter.js"
const router = Router();

router.get("/details", authMiddleware, userDetail);
router.post("/update", authMiddleware, multer.single("profile"), updateUser);
router.get("/friends", authMiddleware, getAllUser);

export default router;