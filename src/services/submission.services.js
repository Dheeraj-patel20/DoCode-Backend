import {submitBatch} from "../utils/judge0.js";
import { Problem } from "../models/problem.model.js";
import { ApiError } from "../utils/api-error.js";
import languageMap from "../utils/languagemap.js";
import { Submission } from "../models/submission.model.js";

const createBatchPayload = async (sourceCode, languageId, hiddenTestCases) => {
  const submissions = [];
  for (const testCase of hiddenTestCases) {
    submissions.push({
      source_code: sourceCode,
      language_id: languageId,
      stdin: testCase.input,
      expected_output: testCase.output,
    });
  }
  return submissions;
};

const submitSolution = async (problemId, language, sourceCode, userId) => {
  const problem = await Problem.findById(problemId);
 
  if (!problem) {
    throw new ApiError(404, "Problem not found");
  }
  const { hiddenTestCases, timeLimit, memoryLimit } = problem;
  const languageId = languageMap[language];
  const batch = await createBatchPayload( sourceCode, languageId, hiddenTestCases );

  const submission=await Submission.create(
    {
        user:userId,
        problem:problemId,
        sourceCode:sourceCode,
        language:language,
        status:"Pending",
        totalTestCases:hiddenTestCases.length,
        judge0Tokens:[],
    }
  )

  const judge0Response = await submitBatch(batch);
  const tokens=judge0Response.map((item)=>
           
    item.token,

  );
  submission.judge0Tokens=tokens;

  await submission.save();
  return submission;
};


export { createBatchPayload, submitSolution };
