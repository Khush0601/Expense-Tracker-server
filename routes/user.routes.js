import {signIn, signUp,autoLogin} from "../controller/user.controller.js";
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/signUp", signUp);
router.get("/signIn",signIn)
router.get('/autoLogin',[verifyToken],autoLogin)


export default router;