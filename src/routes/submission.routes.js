import { Router } from "express";
import { submitSolution } from "../controllers/submission.controllers.js";
import SubmissionValidator from "../validators/submission.validators.js";
import { validate } from "../middlewares/Validator.middleware.js";

const router=Router();

router.route("/").post(SubmissionValidator(),validate,submitSolution);


export default router;