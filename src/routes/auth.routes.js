import {Router} from 'express';
import {forgotPasswordRequest, refreshAccessToken, registerUser, verificationEmail,resetForgotPassword} from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/Validator.middleware.js';
import { userChangeCurrentPasswordValidator, userForgotPasswordValidator, userRegisterValidator,userloginValidator,userResetForgotPasswordValidator } from '../validators/index.js';
import { loginUser,logoutUser,getUser,ResendEmailVerification,changeCurrentPassword} from '../controllers/auth.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router=Router();

//unsecured routes
router.route("/register").post(userRegisterValidator(),validate,registerUser);
router.route("/login").post(userloginValidator(),validate,loginUser);
router.route("/verify-email/:VerificationToken").get(verificationEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidator(),validate,forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(userResetForgotPasswordValidator(),validate,resetForgotPassword);


//secured route
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/current-user").get(verifyJWT,getUser);
router.route("/change-password").post(verifyJWT,userChangeCurrentPasswordValidator(),validate,changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT,ResendEmailVerification);

export default router;