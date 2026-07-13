import {validationResult} from 'express-validator';
import { ApiError } from '../utils/api-error.js';

export const validate=(req,res,next)=>{
   
    const errors=validationResult(req);
  
    if(errors.isEmpty())
    {
        return next();
    }
    const extractedErrors=[];
    errors.array().map((err)=>
        extractedErrors.push({
            [err.path]:err.msg
        })

    )
 

// if (!errors.isEmpty()) {
//   return res.status(400).json({
//     success: false,
//     errors: errors.array(),
//   });
// }

next();

    throw new ApiError(422,"Recieved Data is Not Valid",extractedErrors);

}