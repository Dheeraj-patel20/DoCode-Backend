import { User } from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // console.log(req.cookies);
// console.log(req.headers.authorization);
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
  if (!token) {
    throw new ApiError(401, "Unauthorized Request");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   const user=await User.findById(decoded?._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
    );
    if(!user)
    {
        throw new ApiError(404,"Invalid access token");
    }
    req.user=user
    next()
  } catch (error) {
    throw new ApiError(404,"Invalid Access Token");
  }
});
