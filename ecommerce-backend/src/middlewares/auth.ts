//middleware makesure only admin will aloowed

import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const adminOnly=TryCatch(async(req,res,next)=> {


    const {id}=req.query;//query ka mtlab hota hai jo ham optional me dete hai http://localhost:4000/api/v1/user/all?id=sodniv

    if(!id) return next(new ErrorHandler("do login first",401));

    const user=await User.findById(id);
    if(!user) return next(new ErrorHandler("you give fake id",401));

    if(user.role !=="admin") return next(new ErrorHandler("its not the admin",403));

    next(); //agar apan sirf next pass karege to chain me dekhege ki route me iske next wala access ho jayega
    
});