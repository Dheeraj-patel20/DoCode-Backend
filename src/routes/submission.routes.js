import { Router } from "express";
import { getSubmission, submitSolutionController,getSubmissionById, getSubmissionByProblemId,getSubmissionResult} from "../controllers/submission.controllers.js";
import SubmissionValidator from "../validators/submission.validators.js";
import { validate } from "../middlewares/Validator.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.route("/").post(verifyJWT,SubmissionValidator(),validate,submitSolutionController);
router.route("/").get(getSubmission);
router.route("/:submissionId").get(getSubmissionById);
router.route("/problems/:problemId").get(getSubmissionByProblemId);
router.route("/result/:submissionId").get(getSubmissionResult);



export default router;