import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Request } from "express";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";



export const myOrders=TryCatch(
  async(req,res,next)=>{

    const {id: user} = req.query;

    const key =`my-order-${user}`;

    let order=[];

    if(myCache.has(key)) order=JSON.parse(myCache.get(key) as string);
    else{
      order=await Order.find({user});
      myCache.set(key,JSON.stringify(order));
    }
     
        return res.status(200).json({
          success: true,
          order,
        });

  }

  );


      
export const allOrders=TryCatch(
  async(req,res,next)=>{

   
    const key =`all-order`;

    let order=[];

    if(myCache.has(key)) order=JSON.parse(myCache.get(key) as string);
    else{
      order=await Order.find().populate("user","name"); /* The populate() method is used to replace the specified path (user) in the order documents with documents from a referenced collection (likely the users collection).*/
      myCache.set(key,JSON.stringify(order));
    }
     
        return res.status(200).json({
          success: true,
          order,
        });

  }

  );


  export const getSingleOrder=TryCatch(
    async(req,res,next)=>{
  
     const {id} = req.params;
      const key =`order-${id}`;
  
      let order;
  
      if(myCache.has(key)) order=JSON.parse(myCache.get(key) as string);
      else{
        order=await Order.findById(id).populate("user","name");
        if(!order) return next(new ErrorHandler("order not found",404)); /* The populate() method is used to replace the specified path (user) in the order documents with documents from a referenced collection (likely the users collection).*/
        myCache.set(key,JSON.stringify(order));
      }
       
          return res.status(200).json({
            success: true,
            order,
          });
  
    }
  
    );


    
export const newOrder=TryCatch(
  async(req: Request<{},{},NewOrderRequestBody>,res,next)=>{
      const {
          shippingInfo,
          orderItems,
          user,
          subtotal,
          tax,
          shippingCharges,
          discount,
          total,
        } = req.body;

        if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
          return next(new ErrorHandler("Please Enter All Fields", 400));
    

       const order= await Order.create({
          shippingInfo,
          orderItems,
          user,
          subtotal,
          tax,
          shippingCharges,
          discount,
          total,
        });

        await reduceStock(orderItems);//ye promise return karta hai to yha par awit lga dege

        invalidateCache({
          product: true,
          order: true,
          admin: true,
          userId: user,
          productId: order.orderItems.map((i) => String(i.productId)),

        });//ye isliye add kiye hai taki order palced hone ke bad stock se ghate ga to wo product ko bhi htana hoga

        return res.status(201).json({
          success: true,
          message: "Order Placed Successfully",
        });

  }

  );


  
export const processOrder=TryCatch(
  async(req,res,next)=>{

    const { id } = req.params;

    const order = await Order.findById(id);
  
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
  
    switch (order.status) {
      case "Processing":
        order.status = "Shipped";
        break;
      case "Shipped":
        order.status = "Delivered";
        break;
      default:
        order.status = "Delivered";
        break;
    }
  
    await order.save();
       
    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
     
    });//ye isliye add kiye hai taki order palced hone ke bad stock se ghate ga to wo product ko bhi htana hoga

        return res.status(200).json({
          success: true,
          message: "Order Processed Successfully",
        });

  }

  );

  export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
  
    const order = await Order.findById(id);
    if (!order) return next(new ErrorHandler("Order Not Found", 404));
  
    await order.deleteOne();
  
    invalidateCache({
      product: false,
      order: true,
      admin: true,
      userId: order.user,
      orderId: String(order._id),
     
    });
  
    return res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
  });