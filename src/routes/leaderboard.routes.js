import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLeaderBoard } from "../controllers/leaderboard.controllers.js";


const router=Router();

router.route("/").get(getLeaderBoard);


export default router;
