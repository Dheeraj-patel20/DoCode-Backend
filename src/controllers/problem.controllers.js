import { Problem } from "../models/problem.model.js";
import asyncHandler from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";


const createProblem=asyncHandler(async (req,res)=>{
    const {
  title,
  slug,
  description,
  difficulty,
  constraints,
  examples,
  visibleTestCases,
  hiddenTestCases,
  starterCode,
  hints,
  editorial,
  tags,
  companies,
  timeLimit,
  memoryLimit,
} = req.body;

const existingTitle=await Problem.findOne({
    title
});


const existingSlug=await Problem.findOne({
    slug

});
if(existingSlug||existingTitle)
{
    throw new ApiError(400,"Problem already exists");
}
const problem=await Problem.create({
     title,
  slug,
  description,
  difficulty,
  constraints,
  examples,
  visibleTestCases,
  hiddenTestCases,
  starterCode,
  hints,
  editorial,
  tags,
  companies,
  timeLimit,
  memoryLimit,

})


if(!problem)
{
    throw new ApiError(404,"Problem is not created");
}

return res.status(200).json(new ApiResponse(200,{},"Problem is created successfully"));



});

const getProblem=asyncHandler(async (req,res)=>{
  const {
  page = 1,
  limit = 20,
  search,
  difficulty,
  sort,
} = req.query;
const query={};
    const booksPerPage=limit;
    if(search)
    {
        query.title={
        $regex:search,
        $options:"i"
    };
    }
    if(difficulty)
    {
        query.difficulty=difficulty;
    }
    const problems=await Problem.find(query,{
       
        title:1,
        slug:1,
        difficulty:1,
    },
   ).skip((page-1)*booksPerPage)
    .limit(booksPerPage);

   const totalProblems = await Problem.countDocuments();
    const totalPages=Math.ceil(totalProblems/booksPerPage);

    const pagination={
        currentPage:page,
        limit:booksPerPage,
        totalProblems:totalProblems,
        totalPages:totalPages,
        hasNextpage:(page<totalPages)?"true":"false",
        hasPreviousPage:(page>1)?"true":"false",

    };

    if(problems.length==0)
    {
        throw new ApiError(404,"Problem Does not exists");
    }
   
return res.status(200).json( new ApiResponse(200,{problems,pagination},"send"));

});

const getProblemBySlug=asyncHandler(async(req,res)=>{
    const {slug}=req.params;
  

    const problem=await Problem.findOne({slug});
    if(!problem)
    {
        throw new ApiError(404,"Sorry there is not problem");
    }
  return res.status(200).json(new ApiResponse(200,problem,"Poblem is returned successfully"));
});

const updateProblem=asyncHandler(async(req,res)=>{
    const {slug}=req.params;
    const problemExistence=await Problem.findOne({slug});
    if(!problemExistence)
    {
        throw new ApiError(404,"Problem Doesn't exists");
    }
    const {
  title,
  description,
  difficulty,
  constraints,
  examples,
  visibleTestCases,
  hiddenTestCases,
  starterCode,
  hints,
  editorial,
  tags,
  companies,
  timeLimit,
  memoryLimit
}=req.body;

const problem=await Problem.findOneAndUpdate({slug},{$set:{  title,
  description,
  difficulty,
  constraints,
  examples,
  visibleTestCases,
  hiddenTestCases,
  starterCode,
  hints,
  editorial,
  tags,
  companies,
  timeLimit,
  memoryLimit,
}});


return res.status(200).json(new ApiResponse(200,problem,"Problem Updated Successfully"));


});

const deleteProblem=asyncHandler(async(req,res)=>{
    const {slug}=req.params;
    const problem=await Problem.findOne({slug});
    if(!problem)
    {
        throw new ApiError(404,"Problem Doesn't exist");
    }
    await Problem.deleteOne(problem);

    return res.status(200).json(new ApiResponse(200,[],"Problem Deleted Successfully"));
})

const deleteManyProblem=asyncHandler(async(req,res)=>{
    const { problemIds } = req.body;
    console.log(problemIds);
     if(!problemIds)
    {
        throw new ApiError(400,"Problem id is not defined");
    }
     if (!Array.isArray(problemIds)) {
    throw new ApiError(400, "Problem IDs must be an array");}

    if(problemIds.length==0)
    {
        throw new ApiError(400,"Problem IDs array cannot be empty.");
    }
   

    
    const result=await Problem.deleteMany({
        _id:{
            $in:problemIds
        }

        
    });

    console.log(result);

return res.status(200).json( new ApiResponse(200,result,"Problems deleted successfully"));
})

export {createProblem,getProblem,getProblemBySlug,updateProblem,deleteProblem,deleteManyProblem};