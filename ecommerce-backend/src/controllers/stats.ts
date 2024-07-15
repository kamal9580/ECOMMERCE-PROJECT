import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/features.js";


export const getDashboardStats= TryCatch(async (req,res,next) => {

    let stats ={};

    const key= "admin-stats"

    if(myCache.has(key))
        stats = JSON.parse(myCache.get(key) as string);
    else{
        
        const today= new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        //ye hamne kiya hai ki sixmonth me hamne st kardiya 6 month pahle ka month
  
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

     const lastSixMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    });

    const latestTransactionsPromise = Order.find({})
    .select(["orderItems", "discount", "total", "status"])
    .limit(4);


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
      lastSixMonthOrders,
      categories,
      femaleUsersCount,
      latestTransaction,
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
      lastSixMonthOrdersPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "female" }),
      latestTransactionsPromise,
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

    const orderMonthCounts = new Array(6).fill(0);
    const orderMonthyRevenue = new Array(6).fill(0);

    lastSixMonthOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthyRevenue[6 - monthDiff - 1] += order.total;
      }
    });

  
    const categoryCount=await
    getInventories({
      categories,
      productsCount,
    });

    const userRatio = {
      male: usersCount - femaleUsersCount,
      female: femaleUsersCount,
    };

    const modifiedLatestTransaction = latestTransaction.map((i) => ({
      _id: i._id,
      discount: i.discount,
      amount: i.total,
      quantity: i.orderItems.length,
      status: i.status,
    }));


    
     stats={
        categoryCount,
        changePercent,
        count,
        chart:{
          order: orderMonthCounts,
          revenue: orderMonthyRevenue,
        },
        userRatio,

        latestTransaction: modifiedLatestTransaction,
     };


      myCache.set(key,JSON.stringify(stats));
  
    }



    return res.status(200).json({
        success: true,
        stats,
    });
});

export const getPieCharts= TryCatch(async (req,res,next) => {

  let charts;

  const key="admin-pie-charts"

  if(myCache.has(key))
    charts=JSON.parse(myCache.get(key) as string);

  else{

    const allOrderPromise = Order.find({}).select([
      "total",
      "discount",
      "subtotal",
      "tax",
      "shippingCharges",
    ]);


    const [
      processingOrder,
      shippedOrder,
      deliveredOrder,
      categories,
      productsCount,
      outOfStock,
      allOrders,
      allUsers,
      adminUsers,
      customerUsers,
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.distinct("category"),
      Product.countDocuments(),
      Product.countDocuments({ stock: 0 }),
      allOrderPromise,
      User.find({}).select(["dob"]),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "user" }),
    ]);

    const orderFullfillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder,
    };

    const productCategories = await getInventories({
      categories,
      productsCount,
    });

    const stockAvailablity = {
      inStock: productsCount - outOfStock,
      outOfStock,
    };

    const grossIncome = allOrders.reduce(
      (prev, order) => prev + (order.total || 0),
      0
    );

    const discount = allOrders.reduce(
      (prev, order) => prev + (order.discount || 0),
      0
    );

    const productionCost = allOrders.reduce(
      (prev, order) => prev + (order.shippingCharges || 0),
      0
    );

    const burnt = allOrders.reduce(
      (prev, order) => prev + (order.tax || 0), 0);

    const marketingCost = Math.round(grossIncome * (30 / 100));

    const netMargin =
      grossIncome - discount - productionCost - burnt - marketingCost;

    const revenueDistribution = {
      netMargin,
      discount,
      productionCost,
      burnt,
      marketingCost,
    };// ye ek revenueDistributuin ka object bnaya hai jisme ye ye chiz honge aur upar reduce methoud ki help se nikala hai
     

    const usersAgeGroup = {
      teen: allUsers.filter((i) => i.age < 20).length,//allUsers me dhundho jiska age group 20 s ekam hai us array ka length de do
      adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
      old: allUsers.filter((i) => i.age >= 40).length,
    };

    const adminCustomer = {
      admin: adminUsers,
      customer: customerUsers,
    };

    charts={
      orderFullfillment,
      productCategories,
      stockAvailablity,
      revenueDistribution,
      usersAgeGroup,
      adminCustomer,
    };

    myCache.set(key,JSON.stringify(charts));

   

  }

  return res.status(200).json({
    success:true,
    charts,
  });

});



// export const getLineCharts= TryCatch(async (req,res,next) => {} );

// export const getBarCharts= TryCatch(async (req,res,next) => {} );



export const getBarCharts= TryCatch(async (req,res,next) => {

  let charts;
  const key = "admin-bar-charts";

  if(myCache.has(key)) charts=JSON.parse(myCache.get(key) as string);//string isliye kar rhe hai kyuki string leta hai ya undefined kyuki has hai to undefined hone nhi wala
  
  else{
    
    const today = new Date();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const sixMonthProductPromise = Product.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    
    const sixMonthUsersPromise = User.find({
      createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");

    const twelveMonthOrdersPromise = Order.find({
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    }).select("createdAt");


    const [products, users, orders] = await Promise.all([
      sixMonthProductPromise,
      sixMonthUsersPromise,
      twelveMonthOrdersPromise,
    ]);


    
    const productCounts = getChartData({ length: 6, today, docArr: products });
    const usersCounts = getChartData({ length: 6, today, docArr: users });
    const ordersCounts = getChartData({ length: 12, today, docArr: orders });




    charts={
      users: usersCounts,
      products: productCounts,
      orders: ordersCounts,
      
    };

    myCache.set(key,JSON.stringify(charts));

  }

  return res.status(200).json({
    success:true,
    charts,
  });

});




export const getLineCharts= TryCatch(async (req,res,next) => {

  let charts;
  const key = "admin-line-charts";

  if(myCache.has(key)) charts=JSON.parse(myCache.get(key) as string);

  else {
    const today = new Date();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const baseQuery = {
      createdAt: {
        $gte: twelveMonthsAgo,
        $lte: today,
      },
    };

    const [products, users, orders] = await Promise.all([
      Product.find(baseQuery).select("createdAt"),
      User.find(baseQuery).select("createdAt"),
      Order.find(baseQuery).select(["createdAt", "discount", "total"]),
    ]);

    const productCounts = getChartData({ length: 12, today, docArr: products });
    const usersCounts = getChartData({ length: 12, today, docArr: users });
    const discount = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "discount",
    });
    const revenue = getChartData({
      length: 12,
      today,
      docArr: orders,
      property: "total",
    });

    charts = {
      users: usersCounts,
      products: productCounts,
      discount,
      revenue,
    };

    myCache.set(key,JSON.stringify(charts));

  }

  return res.status(200).json({
    success: true,
    charts,
  });

});


