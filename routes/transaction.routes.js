import {createTransaction, getTransaction} from "../controller/transaction.controller.js";
import express from "express"


const router = express.Router();
router.post("/createTransaction", createTransaction);
router.get("/getTransaction/:userId",getTransaction)


export default router;