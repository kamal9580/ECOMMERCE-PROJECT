import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Request } from "express";
import { invalidateCache, reduceStock } from "../utils/features.js";


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

          await Order.create({
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total,
          });

          await reduceStock(orderItems);

          await invalidateCache({product: true});




    }

    );