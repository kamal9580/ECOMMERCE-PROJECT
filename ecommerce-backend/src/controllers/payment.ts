import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";


export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount) return next(new ErrorHandler("Please enter amount", 400));

  //stripe.paymentIntents.create() is a method from the Stripe library to create a new payment intent.

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: "inr",
  });

// "clientSecret": "pi_3PcprdRrugg92tV01O9JGbuj_secret_gYTPgGlNXmC8ijmk1mamaRRnU"  this client secret help in frontend ki hame jo frontend me card ki payment kholna hota hai wo kiski kholni hai wo kaise pta chalega 


  return res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});



export const newCoupon = TryCatch(async (req, res, next) => {
    const { code, amount } = req.body;
  
    if (!code || !amount)
      return next(new ErrorHandler("Please enter both coupon and amount", 400));
  
    await Coupon.create({ code, amount });
  
    return res.status(201).json({
      success: true,
      message: `Coupon ${code} Created Successfully`,
    });
  });

  export const applyDiscount = TryCatch(async (req, res, next) => {
    const { coupon } = req.query;//query se coupon liya
  
    const discount = await Coupon.findOne({ code: coupon });//database me find kiya
  
    if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));//agar nhi hai to
  
    return res.status(200).json({
      success: true,
      discount: discount.amount,
    });
  });


  export const allCoupons = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});
  
    return res.status(200).json({
      success: true,
      coupons,
    });
  });


  export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;  /*  req.params is an object that contains route parameters (parameters specified in the route path). These parameters are extracted from the URL and made accessible in the request object (req) when a route is matched. Route parameters are typically used to capture specific values from the URL, */
  
    const coupon = await Coupon.findByIdAndDelete(id);
  
    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));
  
    return res.status(200).json({
      success: true,
      message: `Coupon ${coupon.code} Deleted Successfully`,
    });
  });
  