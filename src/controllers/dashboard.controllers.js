import { Submission } from "../models/submission.model.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { Problem } from "../models/problem.model.js";
import { query } from "express-validator";
import { error } from "node:console";


const getDashboard=asyncHandler(async(req,res)=>{
const userId=req.user._id;
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
    acceptanceRate=Number((acceptedSubmission/totalSubmission)*100).toFixed(2);
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
const submissions=await Submission.find(  { user: userId },
        
{
  problem: 1,
  language: 1,
  verdict: 1,
  createdAt: 1
}).populate("problem","title")
    .sort({createdAt:-1})
    .limit(5);


    return res.status(200)
              .json(new ApiResponse(200,submissions,"Recent activity is returned successfully"));


});

const getSolvedProblems=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const query={
        user:userId,
        verdict:"Accepted",
    }
   const solvedproblemsId=await Submission.distinct("problem",query);
   const solvedProblems=await Problem.find({_id: { $in: solvedproblemsId }},{
    title:1,
    difficulty:1,
    slug:1
   }).sort({createdAt:-1});


return res.status(200).json(new ApiResponse(200,solvedProblems,"SolvedProblems are returned successfully"));
});

const totalProblems=asyncHandler(async(req,res)=>{
    
    const userId=req.user.id;

    const totalProblems=await Submission.distinct("problem",{user:userId});

    return res.status(200).json(new ApiResponse(200,totalProblems.length,"Total problems solved returned successfully"));

});

const countDifficulty=asyncHandler(async(req,res)=>{
 const user=req.user._id;
 const verdict="Accepted";
 const query={
    verdict,
    user
 }
 const problemIds=await Submission.distinct("problem",query);
 const difficulty=await Problem.find({_id:{
$in:problemIds
 }},{difficulty:1});
 let easyCount=0;
 let hardCount=0;
 let mediumCount=0;

 for(const prob of difficulty)
 {
    if(prob.difficulty=="Easy")
    {easyCount++;}
    else if(prob.difficulty=="Hard")
    {
        hardCount++;
    }
    else{
        mediumCount++;
    }
 }

 return res.status(200).json(new ApiResponse(200,{easyCount,hardCount,mediumCount},"Returned Successsullly"));
});

const languagesCount=asyncHandler(async(req,res)=>{
const user=req.user._id;
const submissions=await Submission.find({user},{
    language:1
});

const languageCount = new Map();
for(const submission of submissions)
{const language=submission.language;
    if(languageCount.has(language))
    {
        languageCount.set(language,languageCount.get(language)+1);
    }
    else
        {
            languageCount.set(language,1);
        }

}
const languageStats=Object.fromEntries(languageCount);

return res.status(200).json(new ApiResponse(200,languageStats,"Language statistics returned successfully"));
});

const SubmissionStatistics=asyncHandler(async(req,res)=>{
    const user=req.user._id;
   
   const submissions=await Submission.find({user},{
        verdict:1,
    });

    const verdictsCount=new Map();
   for(const submission of submissions)
   {
      const verdict=submission.verdict;
      if(verdictsCount.has(verdict))
      {
           verdictsCount.set(verdict,verdictsCount.get(verdict)+1);
      }
      else
      {
        verdictsCount.set(verdict,1);
      }
   }
   const verdictStatistics=Object.fromEntries(verdictsCount);

   res.status(200).json(new ApiResponse(200,verdictStatistics,"Submission statistics returned successfully."));
});

export {getDashboard,recentActivity
        ,getSolvedProblems,totalProblems
        ,countDifficulty,languagesCount
        ,SubmissionStatistics};