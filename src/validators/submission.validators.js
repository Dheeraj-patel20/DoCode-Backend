import { body } from "express-validator";

const SubmissionValidator=()=>{
  return [  
            body("problemId")
            .trim()
            .notEmpty()
            .withMessage("Problem does'nt exists")
            .isMongoId()
            .withMessage("Object id is not valid"),

            body("language")
            .trim()
            .notEmpty()
            .withMessage("Language is not selected")
            .isIn(["JavaScript","Python","Java","C++","cpp"])
            .withMessage("Invalid language select from the above"),

            body("sourceCode")
            .trim()
            .notEmpty()
            .withMessage("Source code is empty")
           


                             
  ]
}

export default SubmissionValidator;