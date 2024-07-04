import express from "express";
import { newUser } from "../controllers/user.js";
const app = express.Router();
//route- /api/v1/user/new
app.post("/new", newUser); ///new pahle kam nhi karta lekin ab iska route hoga
export default app;
