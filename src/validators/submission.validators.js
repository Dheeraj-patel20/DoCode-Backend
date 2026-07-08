import { body } from "express-validator";

const SubmissionValidator=()=>{
  return [  
            body("problemId")
            .trim()
            .notEmpty()
            .withMessage("Problem does'nt exists")
            .ObjectId.isValid()
            .withMessage("Object id is not valid"),

            body("language")
            .trim()
            .notEmpty()
            .withMessage("Language is not selected"),

            body("sourceCode")
            .trim()
            .notEmpty()
            .withMessage("Source code is empty")
            .oneOf(["JavaScript","Python","Java","C++",])
            .withMessage("Invalid language select from the above")


                             
  ]
}

export default SubmissionValidator;