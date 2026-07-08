import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { emailverificationmailgencontent, sendEmail,forgotpasswordnmailgencontent } from "../utils/mail.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const generateAccessRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accesToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accesToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went Wrong While Generating Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;


  const existingEmailUser = await User.findOne({
    email 
  });
  const existingUsernameUser = await User.findOne({
   username
  });
let user;

if(existingUsernameUser)
{
  throw new ApiError(404,"Username already taken");
}

if(existingEmailUser?.isEmailVerified)
{
  throw new ApiError(404,"Email already belong to an verified account");
}
  if (!existingEmailUser) {
   user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });
  }
  else
  {
    user=existingEmailUser;
  }
 
 
  
    const { UnHashed_Token, HashedToken, TokenExpiry } =
    
  user.generateTemprorayToken();

  user.emailVerificationToken = HashedToken;
  user.emailVerificationExpiry = TokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please Verify Your Email",
    mailgenContent: emailverificationmailgencontent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${UnHashed_Token}`,
    ),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something Went wrong while registring he user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User is registered successfully and the email has been sent to your email ",
      ),
    );
 
 
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  if (!email) {
    throw new ApiError(400, "Username or Email is Required");
  }
  const user = await User.findOne({ email });
  const name = await User.findOne({ username });
  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { accesToken, refreshToken } = await generateAccessRefreshTokens(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );


  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accesToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accesToken,
          refreshToken,
        },

        "User is logged in successfully",
      ),
    );
});


const logoutUser = asyncHandler(async (req, res) => {
    // console.log(req.user);
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,//once everything is done give me the most updated object
    },

  );
  const options={
    http:true,
    secure:true,
  }
  return res.status(200)
            .clearCookie("accessToken",options)
            .clearCookie("refreshToken",options)
            .json(new ApiResponse(200,{},"User logged out"))
});

const getUser=asyncHandler(async (req,res)=>{
  return res.status(200).json(new ApiResponse(200,req.user,"Current User is Returned Successfully"));
});

const verificationEmail=asyncHandler(async(req,res)=>{
  const VerificationToken=req.params.VerificationToken;
  if(!VerificationToken)
  {
    throw new ApiError(400,"Email verificaion token is missing ");
  }
 
  let hashedToken= crypto
                   .createHash("sha256")
                   .update(VerificationToken)
                   .digest("hex")
                 
  const user=await User.findOne({
    emailVerificationToken:hashedToken,
    emailVerificationExpiry:{$gt:Date.now()}
  });
 

  if(!user)
  {
    throw new ApiError(400,"Token is not valid or has been already expired")
  }
  user.emailVerificationToken=undefined
  user.emailVerificationExpiry=undefined
user.isEmailVerified=true
await user.save({validateBeforeSave:false});

res.status(200).json(200,new ApiResponse(200,{isEmailVerified:true},"Email is verified"))
})

const ResendEmailVerification=asyncHandler(async(req,res)=>{
  //req.user._id==>>>It Means That the user is logged in 

  const user=await User.findById(req.user._id);
  if(!user)
  {
    throw new ApiError(404,"User does not exist");
  }
  if(user.isEmailVerified)
  {
    throw new ApiError(409,"Email is Already verified");
  }
  const {UnHashed_Token,hashedToken,TokenExpiry}=
        user.generateTemprorayToken();

    user.emailVerificationToken=hashedToken;
    user.emailVerificationExpiry=TokenExpiry;

    await user.save({
      validationBeforeSave:false
    });
  
    await sendEmail({
      email:user?.email,
      Subject:"Please verify your Email",

      mailgenContent:emailverificationmailgencontent(
        user.username,
        `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${UnHashed_Token}`
      ),


      
    });
    
  return res.status(200).json(new ApiResponse(200,{},"Email has been sen to your mail id"));


})

const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshtoken=req.cookies.refreshToken||req.body.refreshToken;
 
  if(!incomingRefreshtoken)
  {
    throw new ApiError(401,"Unauthorized Access Token");

  }
  try {
    const decodedToken=jwt.verify(incomingRefreshtoken,process.env.REFRESH_TOKEN_SECRET);
    const user=await User.findById(decodedToken?._id);
    if(!user)
    {
      throw new ApiError(404,"Invalid access token");

    }
    if(incomingRefreshtoken!==user?.refreshToken)
    {
     throw new ApiError(404,"Refresh token is expired ");
    }

    const options={
      httpOnly:true,
      secure:true
    }

    const {accesToken,refreshToken: newrefreshToken}=await generateAccessRefreshTokens(user._id);
    user.refreshToken=newrefreshToken;
    await user.save();

    return res.status(200)
              .cookie("accessToken",accesToken,options)
              .cookie("refreshToken",newrefreshToken,options)
              .json({
                accesToken,refreshToken:newrefreshToken
              },
            "Token is Refreshed");
                          

   }// catch (error) {
  //   throw new ApiError(401, "Invalid refresh token");

    
  // }
  catch (error) {
  console.error(error);
  throw error;
}
})

const forgotPasswordRequest=asyncHandler(async(req,res)=>{
  const {email}=req.body;
  const user=await User.findOne({email});
  if(!user)
  {
   throw new ApiError(404,"User Does not exists");
  }
 const {UnHashed_Token,HashedToken,TokenExpiry}=user.generateTemprorayToken();
 console.log("UnHashed_Token:", UnHashed_Token);
console.log("HashedToken:", HashedToken);
console.log("TokenExpiry:", TokenExpiry);

 user.forgotPasswordToken=HashedToken;
 user.forgotPasswordexpiry=TokenExpiry;

 await user.save({validateBeforeSave:false});

 await sendEmail({
  email:user?.email,
  subject:"Reset your Password",
  mailgenContent:forgotpasswordnmailgencontent(user.username,`${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${UnHashed_Token}`)
 })

 return res.status(200).json(new ApiResponse(200,{},"Password Reset mail has been sent to your email"));

})

const resetForgotPassword=asyncHandler(async(req,res)=>{
  const {resetToken}=req.params
  const {newPassword,confirmPassword}=req.body
  console.log(newPassword,confirmPassword);

  if(newPassword!==confirmPassword)
  {
    throw new ApiError("401","Password mismatch");
  }

  let hashedToken=crypto
                  .createHash("sha256")
                  .update(resetToken)
                  .digest("hex");

  const user=await User.findOne({
    forgotPasswordToken:hashedToken,
    forgotPasswordexpiry:{$gt:Date.now()}
  })

  if(!user)
  {
    throw new ApiError(489,"Token is invalid or expired");
  }

  user.forgotPasswordexpiry=undefined
  user.forgotPasswordToken=undefined


  user.password=newPassword

  await user.save({validateBeforeSave:false})

  return res.status(200).json(new ApiResponse(200,[],"Password ResetSuccess"));
  
  


})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
const {oldPassword,newPassword}=req.body
const user=await User.findById(req.user?._id)

const isPasswordvalid=await user.isPasswordCorrect(oldPassword)

if(!isPasswordvalid)
{
  throw new ApiError(400,"Invalid old password")
}

user.password=newPassword

await user.save({validateBeforeSave:false})


return res.status(200).json(
new ApiResponse(200,[],"Password Changed Successfully")
)
})

export { 
         registerUser, 
         loginUser, 
         logoutUser ,
         getUser,
         verificationEmail,
         ResendEmailVerification,
         changeCurrentPassword,
         resetForgotPassword,
         refreshAccessToken,
         forgotPasswordRequest,
         
        
        };
