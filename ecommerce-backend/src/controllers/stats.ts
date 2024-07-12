import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";


export const getDashboardStats= TryCatch(async (req,res,next) => {

    let stats ={};

    if(myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats") as string);
    else{
        
        const today= new Date();
  
    const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today, //end of this month is today only because if req for data then we req for start date to today date only so end is today only
      };
  
      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),//lets say date chal rhi hai 23 oct we want last date we get it by 0 means last of hte nov 31 oct
      };

      const thisMonthProductsPromise = Product.find({
        createdAt: {
          $gte: thisMonth.start,  /*  $gte stands for "greater than or equal to".
          thisMonth.start represents the start of the date range.
          $lte stands for "less than or equal to".
          thisMonth.end represents the end of the date range.*/
          $lte: thisMonth.end,
        },
      });//ye hai this month ke product aur yha promise upar niche dono jagah likha hai iska mtlab hai ki 
      //dono ko promise se wrap kiya hai bad promise.all karegege iska mtlab hoga ki jab ye promise jitne me hai sab parallely chalege aur jab tak resolve nhi hota hai tba tak age nhi badega

      const lastMonthProductsPromise = Product.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      }); //ye rahe last month ke product


      const thisMonthUsersPromise = User.find({//yr rha user ke liye
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });
  
      const lastMonthUsersPromise = User.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });

     //ye rha order ke liye
      const thisMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: thisMonth.start,
          $lte: thisMonth.end,
        },
      });
  
      const lastMonthOrdersPromise = Order.find({
        createdAt: {
          $gte: lastMonth.start,
          $lte: lastMonth.end,
        },
      });
  

     //ye ham promise.all karege isse sari promise parallely chalegi

     const [
      thisMonthProducts,
      thisMonthUsers,
      thisMonthOrders,
      lastMonthProducts,
      lastMonthUsers,
      lastMonthOrders,
      productsCount,
      usersCount,
      allOrders,
     ] =await Promise.all([
      thisMonthProductsPromise,
      thisMonthUsersPromise,
      thisMonthOrdersPromise,
      lastMonthProductsPromise,
      lastMonthUsersPromise,
      lastMonthOrdersPromise,
      Product.countDocuments(),
      User.countDocuments(),
      Order.find({}).select("total"),
     ]);

     //The reduce method is used to aggregate the values in an array into a single value. It iterates over each element in the array and applies a function that takes an accumulator (total in this case) and the current element (order).


     const thisMonthRevenue = thisMonthOrders.reduce( //basically total is previous value value and order is current value
      (total, order) => total + (order.total || 0),
      0
    );

    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      0
    );

     const changePercent = {
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product:calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
       ),

       user: calculatePercentage(
        thisMonthUsers.length,
        lastMonthUsers.length
       ),

       order:calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
       ),
     };

     const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),//alll orders ka revenue find karna hai 
      0
    );

    const count = {
      revenue,
      product: productsCount,
      user: usersCount,
      order: allOrders.length,
    };

    
     stats={
        changePercent,
        count,
     };



  
    }



    return res.status(200).json({
        success: true,
        stats,
    });
});

export const getPieCharts= TryCatch(async () => {});
export const getBarCharts= TryCatch(async () => {});
export const getLineCharts= TryCatch(async () => {});


