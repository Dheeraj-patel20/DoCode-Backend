import { body } from "express-validator";


const ProblemValidator = () => {
  return [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  

    body("slug")
      .trim()
      .toLowerCase()
      .notEmpty()
      .withMessage("Slug is Required"),
      
        body("description")
    .notEmpty()
    .withMessage("Description should be there"),

    body("difficulty")
      .trim()
      .notEmpty()
      .withMessage("Difficulty is required")
      .isIn(["Easy", "Medium", "Hard"]),

    body("constraints")
      .trim()
      .notEmpty()
      .withMessage("Constraints are required"),

    body("examples")
      .isArray({ min: 1 })
      .withMessage("At least one example is required"),

    body("visibleTestCases")
      .isArray({ min: 1 })
      .withMessage("At least one visible test case is required"),

    body("hiddenTestCases")
      .isArray({ min: 1 })
      .withMessage("At least one hidden test case is required"),

    body("starterCode")
      .isArray({ min: 1 })
      .withMessage("Starter code is required"),

    body("hints").optional().isArray().withMessage("Hints must be an array"),

    body("editorial").optional().trim(),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("companies")
      .optional()
      .isArray()
      .withMessage("Companies must be an array"),

    body("timeLimit").isNumeric().withMessage("Time limit must be a number"),

    body("memoryLimit")
      .isNumeric()
      .withMessage("Memory limit must be a number"),
  ];
};


export  {ProblemValidator};