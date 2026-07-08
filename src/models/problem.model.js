import mongoose from "mongoose";
import { Schema } from "mongoose";

const ProblemSchema = new Schema({
  title: {
    type: String,
    required:true,
    trim:true,
  },
  slug: {
    type: String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
  },
  description: {
    type: String,
  },
  difficulty: {
    type: String,
  },
  constraints: {
    type: String,
  },
  examples: [
  {
    input: String,
    output: String,
    explanation: String,
  }
],
visibleTestCases: [
  {
    input: String,
    output: String,
  }
],
 hiddenTestCases: [
  {
    input: String,
    output: String,
  }
],

  starterCode: [
  {
    language: String,
    code: String,
  }
],
  editorial: {
    type: String,
  },
 hints: [
  String
],

tags: [
  String
],
 hints: [
  String
],
companies: [
  String
],

  timeLimit: {
    type: Number,
  },
  memoryLimit: {
    type: Number,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },

  isPublished: {
    type: Boolean,
    default:false,
  },
 
},
 { timestamps:true,

 });

export const Problem = mongoose.model("Problem", ProblemSchema);
