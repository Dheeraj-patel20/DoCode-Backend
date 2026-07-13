import {Router} from 'express';
import { healthCheck } from '../controllers/healthcheck.controllers.js';
const router=Router();
//prefix to every single line 
router.route("/").get(healthCheck);


export default router;
