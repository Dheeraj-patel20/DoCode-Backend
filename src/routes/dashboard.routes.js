import { Router } from "express";
import {validate} from '../middlewares/Validator.middleware.js';
import { countDifficulty, getDashboard, 
         getSolvedProblems, recentActivity, 
         totalProblems , languagesCount,SubmissionStatistics} from "../controllers/dashboard.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router=Router();

router.route("/").get(verifyJWT,getDashboard);
router.route("/recent-activity").get(verifyJWT,recentActivity);
router.route("/solved-problems").get(verifyJWT,getSolvedProblems);
router.route("/total-problems").get(verifyJWT,totalProblems);
router.route("/difficulty").get(verifyJWT,countDifficulty);
router.route("/language-statistics").get(verifyJWT,languagesCount);
router.route("/submission-statistics").get(verifyJWT,SubmissionStatistics);

export default router;