import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";
const app = express.Router();
//route- /api/v1/payment/coupon/discount
app.get("/discount", applyDiscount); // ye get hai ki pahle hamne discount bna liya hai wo database me store ho gya hai 
//ab ham usko get karege to find ki jo coupon ka name hai uspar discount kitna hai
//route- /api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, newCoupon); ///new pahle kam nhi karta lekin ab iska route hoga
//route- /api/v1/payment/coupon/all
app.get("/coupon/all", adminOnly, allCoupons); // ye hai ki admin ko dekhne hai ki kaun se coupon baki hai
//route- /api/v1/payment/coupon/:id
app.delete("/coupon/:id", adminOnly, deleteCoupon);
export default app;
