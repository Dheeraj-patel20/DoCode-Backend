import { Router } from "express";
import {validate} from '../middlewares/Validator.middleware.js';
import { getDashboard, getSolvedProblems, recentActivity } from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router=Router();

router.route("/").get(verifyJWT,getDashboard);
router.route("/recent-activity").get(verifyJWT,recentActivity);
router.route("/solved-problems").get(verifyJWT,getSolvedProblems)

export default router;