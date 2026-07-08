import { body } from "express-validator";

const userRegisterValidator=()=>{
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is Required")
        .isEmail()
        .withMessage("Email is invalid"),

        body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is Required")
        .isLowercase()
        .withMessage("Usename Must be in Lowercase")
        .isLength({min:3})
        .withMessage("Username should be of min 3 words"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is Required")
        .isLength({min:5})
        .withMessage("password should be of minimum be of length 5")


    ]
}

const userloginValidator=()=>{

    return[
        body("email")
        .trim()
        .notEmpty()
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),

        body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
       
    ]
}

const userChangeCurrentPasswordValidator=()=>{

    return [
        body("oldPassword")
        .notEmpty()
        .withMessage("Password is required "),

        body("newPassword")
        .notEmpty()
        .withMessage("New password is required"),

    ]
}

const userForgotPasswordValidator=()=>{
    return body("email")
           .trim()
           .notEmpty()
           .withMessage("Email is required")
           .isEmail()
           .withMessage("Email is invalid")
}

const userResetForgotPasswordValidator=()=>{
    
    return [
        body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("Password is Required"),

        body("confirmPassword")
        .trim()
        .notEmpty()
        .withMessage("Enter the password")
    ];
}

export {userRegisterValidator,
        userloginValidator,
        userChangeCurrentPasswordValidator,
        userForgotPasswordValidator,
        userResetForgotPasswordValidator
    };