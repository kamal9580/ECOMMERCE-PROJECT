import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
export const newOrder = TryCatch(async (req, res, next) => {
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total, } = req.body;
    if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
        return next(new ErrorHandler("Please Enter All Fields", 400));
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
    await reduceStock(orderItems); //ye promise return karta hai to yha par awit lga dege
    await invalidateCache({
        product: true,
        order: true,
        admin: true,
    }); //ye isliye add kiye hai taki order palced hone ke bad stock se ghate ga to wo product ko bhi htana hoga
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
});
export const myOrders = TryCatch(async (req, res, next) => {
    return res.status(201).json({
        success: true,
        message: "Order Placed Successfully",
    });
});
