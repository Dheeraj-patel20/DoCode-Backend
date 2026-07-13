import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import languageMap from "../utils/languagemap.js";
import { getBatchResult } from "../utils/judge0.js";
import { submitSolution } from "../services/submission.services.js";

const submitSolutionController=asyncHandler(async (req,res)=>{

  const { problemId,
    language,
    sourceCode}=req.body;
  const userId=req.user._id;

  const submission=await submitSolution(
    problemId,
    language,
    sourceCode,
    userId,
);

return res.status(202).json(new ApiResponse(202,submission,"Solution submitted successfully"));

});

const getSubmission = asyncHandler(async (req, res) => {
  const { verdict, language } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const query = { user: req.user._id };
  if (verdict) {
    query.verdict = verdict;
  }
  if (language) {
    query.language = language;
  }

  const submission = await Submission.find(query)
    .populate("problem", "title slug difficulty")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  const totalSubmissions = await Submission.countDocuments(query);
  const totalPages = Math.ceil(totalSubmissions / limit);
  const pagination = {
    currentPage: page,
    limit: limit,
    totalPages: totalPages,
    totalSubmissions: totalSubmissions,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { submission, pagination },
        "Submissions fetched successfully",
      ),
    );
});

const getSubmissionById = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const userId = req.user._id;
  const submission = await Submission.findById(submissionId, {
    user:1,
    problem: 1, 
    sourceCode: 1,
    language: 1,
    verdict: 1,
    createdAt: 1,
  }).populate("problem", "title slug difficulty");

  if (!submission) {
    throw new ApiError(404, "Submission doesn't exists");
  }

  if (!submission.user.equals(userId)) {
    throw new ApiError(403, "You are not authorized to view this submission");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { submission }, "Submission recieved"));
});

const getSubmissionByProblemId = asyncHandler(async (req, res) => {
  const problemId = req.params.problemId;
  const userId = req.user._id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const query = { user: userId, problem: problemId };

  const submission = await Submission.find(query, {
    problem: 1,
    sourceCode: 1,
    language: 1,
    verdict: 1,
  })
    .populate("problem", "title slug")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({
      createdAt: -1,
    });
  const totalSubmissions = await Submission.countDocuments(query);
  const totalPages = Math.ceil(totalSubmissions / limit);
  const pagination = {
    currentPage: page,
    limit: limit,
    totalPages: totalPages,
    totalSubmissions: totalSubmissions,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { submission, pagination },
        "Submission returned successfully",
      ),
    );
});

const getSubmissionResult=asyncHandler(async(req,res)=>{
const {submissionId}=req.params;
const submission=await Submission.findById(submissionId);
if (!submission) {
  throw new ApiError(404, "Submission not found");
}
const result=await getBatchResult(submission.judge0Tokens);
let passedTestCases = 0;
let verdict = "Accepted";
let runtime = 0;
let memory = 0;

for (const item of result.submissions) {
  if (item.status.description === "Accepted") {
    passedTestCases++;
  } else {
    verdict = item.status.description;
  }

  runtime = Math.max(runtime, Number(item.time || 0));
  memory = Math.max(memory, Number(item.memory || 0));
}

const isPending = result.submissions.some(
  item =>
    item.status.description === "In Queue" ||
    item.status.description === "Processing"
);

if (isPending) {
  return res.status(200).json(
    new ApiResponse(200, submission, "Submission is still being processed")
  );
}
submission.status = "Completed";
submission.verdict = verdict;
submission.runtime = runtime;
submission.memory = memory;
submission.passedTestCases = passedTestCases;

await submission.save();

 return res.status(200).json(new ApiResponse(200,submission,"Submission result fetched successfully."));

})

export {
  submitSolutionController,
  getSubmission,
  getSubmissionById,
  getSubmissionByProblemId,
  getSubmissionResult
};

// const submitSolution = asyncHandler(async (req, res) => {
//   const { problemId, language, sourceCode } = req.body;
//   const userId = req.user._id;
//   const problem = await Problem.findById(problemId);

//   if (!problem) {
//     throw new ApiError(404, "No problem exists");
//   }
//   const hiddenTestCases = problem.hiddenTestCases;
//   const timeLimit = problem.timeLimit;
//   const memoryLimit = problem.memoryLimit;
//   const convertedLang = languageMap[language];
//   let passedTestCases = 0;
//   let verdict;
//   let runtime;
//   let memory;
//   for (const testCase of hiddenTestCases) {
//     const result = await executeCode(sourceCode, convertedLang, testCase.input);
//     if (result.status.id !== 3) {
//       verdict = result.status.description;
//       break;
//     }
//     if (testCase.output == result.stdout) {
//       passedTestCases++;
//     } else {
//       verdict = "Wrong Answer";
//       break;
//     }
//   }
//   if (passedTestCases === hiddenTestCases.length) {
//     verdict = "Accepted";
//   }

//   const submission = await Submission.create({
//     user: userId,
//     problem: problemId,
//     sourceCode: sourceCode,
//     language: language,
//     verdict,
      // status,
//     passedTestCases: passedTestCases,
//     totalTestCases: hiddenTestCases.length,
//     runtime: runtime,
//     memory: memory,
//   });

//   return res
//     .status(201)
//     .json(
//       new ApiResponse(
//         201,
//         { submission },
//         "Submission is created successfully ",
//       ),
//     );
// });