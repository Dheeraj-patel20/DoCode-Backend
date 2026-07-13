import { Submission } from "../models/submission.model.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Problem } from "../models/problem.model.js";


const getDashboard=asyncHandler(async(req,res)=>{
const userId=req.user._id;


const {verdict,language}=req.query;
const query1={
    user:userId,
};
const query2={
    user:userId,
    verdict:"Accepted",
}

const totalSubmission=await Submission.countDocuments(query1);

const acceptedSubmission=await Submission.countDocuments(query2);
const totalSolvedProblems=await Submission.distinct("problem",query2);
let acceptanceRate=0;
if(totalSubmission!==0)
{
    acceptanceRate=(acceptedSubmission/totalSubmission)*100;
}

const Response={
    totalSubmission:totalSubmission,
    acceptedSubmission:acceptedSubmission,
    totalSolvedProblems:totalSolvedProblems.length,
    acceptanceRate:acceptanceRate,
}


return res.status(200)
          .json(new ApiResponse(200,Response,"The Submision details returned successfullt"));

});

const recentActivity=asyncHandler(async(req,res)=>{
const userId=req.user._id;
const submission=await Submission.find(  { user: userId },
        
{
  problem: 1,
  language: 1,
  verdict: 1,
  sourceCode: 1,
  createdAt: 1
}).populate("problem","title")
    .sort({createdAt:-1})
    .limit(5);


    return res.status(200)
              .json(new ApiResponse(200,submission,"Recent activity is returned successfully"));



});

const getSolvedProblems=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const query={
        user:userId,
        verdict:"Accepted",
    }
   const solvedproblemsId=await Submission.distinct("problem",query);
   const problem=await Problem.find({_id: { $in: solvedproblemsId }},{
    title:1,
    difficulty:1,
    slug:1
   });


return res.status(200)
          .json(new ApiResponse(200,problem,"Problem returned successfully"));
});

export {getDashboard,recentActivity,getSolvedProblems};