import {signIn, signUp,autoLogin, updateUserDetails} from "../controller/user.controller.js";
import express from "express"
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();
router.post("/signUp", signUp);
router.get("/signIn",signIn)
router.get('/autoLogin',[verifyToken],autoLogin)
router.patch("/updateUser/:userId", updateUserDetails);

export default router;