import { Router } from 'express';
import {validate} from '../middlewares/Validator.middleware.js';
import { createProblem, deleteProblem, getProblem, getProblemBySlug, updateProblem } from '../controllers/problem.controllers.js';
import {ProblemValidator} from '../validators/problem.validator.js';


const router=Router();

router.route('/').post(ProblemValidator(),validate,createProblem);
router.route("/").get(getProblem);
router.route("/:slug").get(getProblemBySlug);
router.route("/:slug").patch(updateProblem);
router.route("/:slug").delete(deleteProblem);

export default router;
