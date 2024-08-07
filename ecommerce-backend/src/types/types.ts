
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


export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?:string;
  page?:string;
}

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
};
price?: {$lte: number};
category?: string;

}

export type InvalidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?:boolean;
  userId?: string;
  orderId?:string;
  productId?:string | string[];
};

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}

