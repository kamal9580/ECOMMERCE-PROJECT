import express from "express";
import { myOrders, newOrder } from "../controllers/order.js";
const app = express.Router();
//route- /api/v1/order/new
app.post("/new", newOrder); ///new pahle kam nhi karta lekin ab iska route hoga
app.get("/my", myOrders);
export default app;