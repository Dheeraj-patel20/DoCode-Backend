import { Submission } from "../models/submission.model.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import asyncHandler from "../utils/async-handler.js";
import { totalProblems } from "./dashboard.controllers.js";

const getLeaderBoard = asyncHandler(async (req, res) => {
      const pages=Number(req.params.page||1);
  const limit=Number(req.params.limit||10);
  const skip=((pages-1)*limit);
  const leaderboard=await Submission.aggregate([
    {
      
      $group: {
        _id: "$user",
        totalSubmissions: { $sum: 1 },
        acceptedSubmissions: {
          $sum: {
            $cond: [{ $eq: ["$verdict", "Accepted"] }, 1, 0],
          },
        },
        solvedProblems: {
          $addToSet: {
            $cond: [{ $eq: ["$verdict", "Accepted"] }, "$problem", null],
          },
        },
       
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        username: "$user.username",
        avatar: "$user.avatar",
         totalSolvedproblems: { $size: "$solvedProblems" },
         acceptedSubmissions:1,
         totalSubmissions:1,

      },
    },
    {
      $addFields:{acceptanceRate: {
        $multiply: [
          { $divide: ["$acceptedSubmissions", "$totalSubmissions"] },
          100,
        ],
      }},
    },
    {
      $sort: {
        totalSolvedproblems: -1,
        acceptanceRate: -1,
        username: 1,
      },
    },
    {
        $skip:skip,
     
    },
    {
           $limit:limit,
    }
    


  ]);


  return res.status(200).json(new ApiResponse(200,leaderboard,"Leaderboard returned suceessfully"));

  
});

export {getLeaderBoard};