
  /* The code snippet you've provided is written in TypeScript, which is a superset of JavaScript that includes type definitions. 
  An interface in TypeScript is used to define the shape of an object. It describes the properties that the object can have and their types. */

import { Request,Response,NextFunction } from "express";

  export interface NewUserRequestBody{

    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: Date;


  }

  export interface NewProductRequestBody{

    name: string;
    category: string;
    price:number;
    stock:number;
   
  }


  
export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

