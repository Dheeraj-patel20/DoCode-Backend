import { Problem } from "../models/problem.model.js";
import { Submission } from "../models/submission.model.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import asyncHandler from "../utils/async-handler.js";
import languageMap from "../utils/languagemap.js";
import executeCode from "../utils/judge0.js";

const submitSolution = asyncHandler(async (req, res) => {
  const { problemId, language, sourceCode } = req.body;
  const userId = req.user._id;
  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new ApiError(404, "No problem exists");
  }
  const hiddenTestCases = problem.hiddenTestCases;
  const timeLimit = problem.timeLimit;
  const memoryLimit = problem.memoryLimit;
  const convertedLang = languageMap[language];
  let passedTestCases = 0;
  let verdict;
  let runtime;
  let memory;
  for (const testCase of hiddenTestCases) 
    {
    const result = await executeCode(sourceCode, convertedLang, testCase.input);
    if(result.status.id!==3)
    {
        verdict=result.status.description;
        break;
    }
    if (testCase.output == result.stdout) {
      passedTestCases++;
    } else {
      verdict="Wrong Answer";
      break;
    }
  }
  if (passedTestCases === hiddenTestCases.length) {
    verdict = "Accepted";
  }

  const submission=await Submission.create({
user: userId,
problem: problemId,
sourceCode: sourceCode,
language: language,
verdict: verdict,
passedTestCases: passedTestCases,
totalTestCases: hiddenTestCases.length,
runtime: runtime,
memory: memory,
});

return res.status(201).json(new ApiResponse(201,{submission},"Submission is created successfully "));
 
});

export { submitSolution };
