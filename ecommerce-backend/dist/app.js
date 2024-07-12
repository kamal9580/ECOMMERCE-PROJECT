//WHY WE NEED TSC ITS ANS ************
// TypeScript files (.ts or .tsx) are not directly executable in a typical JavaScript runtime environment (like Node.js or web browsers). They need to be transpiled into plain JavaScript (.js), which is what the TypeScript compiler (tsc) does.
// The dist folder is the designated location for these compiled JavaScript files.
import express from "express";
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan"; //this is a middleware
//importing routes
import userRoute from "./routes/user.js";
import ProductRoute from "./routes/products.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
config({
    path: "./.env",
});
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
connectDB(mongoURI);
export const myCache = new NodeCache();
const app = express();
app.use(express.json());
app.use(morgan("dev")); //kya kya request hamne send kia hai wo btata hai hame
app.get("/", (req, res) => {
    res.send("apt working with /api/v1");
});
//using routes
app.use("/api/v1/user", userRoute); //iska mtlab hoi gya ki userRoute /api/v1/user ko use kar rha hai
app.use("/api/v1/product", ProductRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/uploads", express.static("uploads")); //iska mtlab ki agar ab koi uload folder par jyega wo phot access kae payega
app.use(errorMiddleware);
app.listen(port, () => {
    console.log(` express is running on http://localhost:${port}`);
});
