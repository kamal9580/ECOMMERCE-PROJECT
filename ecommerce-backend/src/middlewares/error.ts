
  import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/types.js";

export const errorMiddleware= (err:ErrorHandler,req:Request,res:Response,next:NextFunction)=>{

    err.message=err.message || "Internal server error";
    err.statusCode ||=500;
         
    return res.status( err.statusCode).json({
      success:false,
      message:err.message,
    });
};

export const TryCatch = (func:ControllerType)=> {

       return (req:Request,res:Response,next:NextFunction) => {  /*these two line are come from newuser   The TryCatch function you've written is a higher-order function designed to wrap around asynchronous controller functions in an Express.js application.      This ensures that any errors that occur within the controller functions are caught and passed to the Express error-handling middleware. */
        return Promise.resolve(func(req,res,next)).catch(next);    
     };
  };