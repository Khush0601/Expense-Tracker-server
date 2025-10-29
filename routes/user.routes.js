import {signIn, signUp} from "../controller/user.controller.js";
import express from "express"
const router = express.Router();
router.post("/signUp", signUp);
router.get("/signIn",signIn)

export default router;