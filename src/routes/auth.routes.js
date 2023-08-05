import { Router } from "express";
import {
    login,
    loginDMSUsers
} from "../controllers/auth.controller"

const router = Router();

router.post("/login", login)
router.post("/login/usersDMS", loginDMSUsers)

export default router;
