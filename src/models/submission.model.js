import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      enum: ["JavaScript", "Python", "Java", "C++","cpp"],
    },

    verdict: {
      type: String,
      default:null,
     
    },
    runtime: {
      type: Number,
    
    },
    memory: {
      type: Number,

      
    },
    passedTestCases: {
      type: Number,
      required: true,
      default: 0,
    },
    totalTestCases: {
      type: Number,
      required: true,
    },
    status:{
       type:String,
       default: "Pending",
       enum: ["Pending", "Running", "Completed", "Failed"],
       required:true,
    },
    judge0Tokens: [
  {
    type: String,
  },
]
  },
  {
    timestamps: true,
  },
);

export const Submission = mongoose.model("Submission", SubmissionSchema);
