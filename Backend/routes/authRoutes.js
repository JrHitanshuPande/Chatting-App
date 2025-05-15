import { Router } from "express";
import { register, login, refreshToken } from "../controllers/authControllers.js"
const router = Router();


router.post("/login", login)

router.post("/register", register);

router.get("/refreshtoken", refreshToken);

export default router;