import express from "express";
import { deleteUser, getAllUsers, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express.Router();
//route- /api/v1/user/new
app.post("/new", newUser); ///new pahle kam nhi karta lekin ab iska route hoga
//route- /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);
//route-api/v1/user/dynamicid  
app.route("/:id").get(getUser).delete(adminOnly, deleteUser); //kuoki dono ka route same tha isliye aisa kiya
//ek chiz aur ki hame ye dekhna hai ki koi bhi akar use delete na kar de ek authenticate admin hona chahiye whi delete kare 
//to ham ek middleware bnayae jo check akrega aur jaha zarurat hai waha add kare
export default app;
