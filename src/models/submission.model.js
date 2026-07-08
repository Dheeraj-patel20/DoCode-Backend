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
      enum: ["JavaScript", "Python", "Java", "C++"],
    },

    verdict: {
      type: String,
      required: true,
      default: "Pending",
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
      ],
    },
    runtime: {
      type: Number,
      required: true,
    },
    memory: {
      type: Number,

      required: true,
    },
    passedTestCases: {
      type: Number,
      required: true,
      passedTestCases: 0,
    },
    totalTestCases: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Submission = mongoose.model("Submission", SubmissionSchema);
