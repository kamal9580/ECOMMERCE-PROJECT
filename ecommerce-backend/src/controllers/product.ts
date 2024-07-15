import { TryCatch } from "../middlewares/error.js";

import { Request,Response,NextFunction } from "express";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";





//ravalidate on new,update,delete product and new order
 export const getLatestProducts =TryCatch(async(req,res,next) => {

    let products;

    if(myCache.has("latest-products"))
        products=JSON.parse(myCache.get("latest-products") as string);
    //The JSON.parse method converts a JSON string into a JavaScript object or array.
    //it parses the JSON string retrieved from the cache and converts it back into the original products array or object.

    else{
        
     products = await Product.find({}).sort({createdAt: -1}).limit(5);

     myCache.set("latest-products",JSON.stringify(products));//yha caching kya kar rhi ki ham jo data get get kar rhae hai use
     //use return karne se pahle locally store kar rahe hai taki jab koi agli bar data get kare to pahle caching me dhudhe na ki database query me jaye jab ham cloud database use karege to usme jyada time lagega caching fast hoti hai
     
     //JSON.stringify is a method that converts a JavaScript object or array (products in this case) into a JSON string.
     //This serialization is necessary because caching mechanisms often store data as strings, and JSON is a widely-used format for data interchange.

     }

     //ek bat aur cache me ek bar data dala to usko niklana bhi padega to iske liye kya kare warna har bar whi data dega chahe ham nya product add kare tab bhi
    
    return res.status(200).json({
        success: true,
        products,
    });
 });

 //ravalidate on new,update,delete product and new order
 export const getAllCategories = TryCatch(async(req,res,next) => {


    let categories;

    if(myCache.has("categories"))
        categories=JSON.parse(myCache.get("categories") as string);
    else{
         categories=await Product.distinct("category");
        myCache.set("categories",JSON.stringify(categories));
    }

    
    return res.status(200).json({
        success: true,
        categories,
    });
 });

 //ravalidate on new,update,delete product and new order
 export const getAdminProducts =TryCatch(async(req,res,next) => {


    let products;

    if(myCache.has("all-products"))
        products=JSON.parse(myCache.get("all-products") as string);
    else{
         products = await Product.find({});
        myCache.set("all-products",JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        products,
    });
 });


//ravalidate on new,update,delete product and new order
 export const getSingleProduct =TryCatch(async(req,res,next) => {
     
    let product;
    const id=req.params.id;

    if(myCache.has("product-${id}"))
        product=JSON.parse(myCache.get("product-${id}") as string);
    else{
         product = await Product.findById(id);
         if(!product) return next(new ErrorHandler("product not found",404));

        myCache.set(`product-${id}`,JSON.stringify(product));
    }

    return res.status(200).json({
        success: true,
        product,
    });
 });


 
export const newProduct=TryCatch(
    async(
        req:Request<{},{},NewProductRequestBody>,
        res:Response,
        next:NextFunction
    )=>{

    const {name,price,stock,category} =req.body;

    const photo =req.file;

    if(!photo) return next(new ErrorHandler("Please Add Photo",400));

     if(!name||!price||!stock||!category)
      {  
            rm(photo.path, () =>{        {/* The rm function from the fs module in Node.js is used to remove files and directories. Here is a detailed explanation of how it works and how you can use it: */}
                console.log("Deleted");
            });//agar photo exist karti hai to delete kar do


        return next(new ErrorHandler("Please Add all fields",400));

      }

 
    await Product.create({
        name,
        price,
        stock,
        category:category.toLowerCase(),
        photo:photo.path,

    });

    invalidateCache({product: true,admin:true});//nya product bante hi purana ko cache se hta do

    return res.status(201).json({
        success:true,
        message:"product created successfully",
    });

});


 
export const updateProduct=TryCatch(
    async(
        req:Request,
        res:Response,
        next:NextFunction
    )=>{

        const {id} = req.params;

    const {name,price,stock,category} =req.body;

    const photo =req.file;

    const product = await Product.findById(id);

    if(!product) return next(new ErrorHandler("product not found",404));

   

     if(photo)
      {  
            rm(product.photo!, () =>{        {/* The rm function from the fs module in Node.js is used to remove files and directories. Here is a detailed explanation of how it works and how you can use it: */}
                console.log("old photo Deleted");
            });//agar photo exist karti hai to delete kar do


        product.photo=photo.path;

      }

      if(name) product.name=name;
      if(price) product.price=price;
      if(stock) product.stock=stock;
      if(category) product.category=category;
      
   await product.save();

    invalidateCache({product: true, 
    productId: String(product._id),
    admin:true,
});

  
    return res.status(200).json({
        success:true,
        message:"product updated successfully",
    });

});

export const deleteProduct =TryCatch(async(req,res,next) => {
    const product = await Product.findById(req.params.id);
    if(!product) return next(new ErrorHandler("product not found",404));

    rm(product.photo!, () =>{       
    console.log("product photo Deleted");
});

    await product.deleteOne();//isse product delete hogi aur hame photo bhi karni hai wo rm se hogi
     invalidateCache({product: true, productId: String(product._id),admin:true});


    return res.status(200).json({
        success: true,
        message:"product deleted successfully",
    });
 });


 export const getAllProducts =TryCatch(
    async(
        req: Request<{},{},{},SearchRequestQuery>,
        res,
        next) => {

            const {search,sort,category,price}=req.query;

            const page = Number(req.query.page)|| 1;

            const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;//iska mtlab par page me kitna product dikhna chahiye
            const skip=(page-1)* limit;


            const baseQuery: BaseQuery = {};

            if(search)
                baseQuery.name={
                    $regex:search, //iska fark nhi padta koi bhi capital me dalu ya small me
                                   //regex ka mtlab rathar than wo word nhi wo pattern dhudhega
                    $options:"i",
                 
                 };

            if(price)
                baseQuery.price={
                   $lte:Number(price),//lte ka mtlab lessa than equal to price
            
                 };

            if(category) baseQuery.category=category;

        const productsPromise =  Product.find(baseQuery)  /* This is a Mongoose model representing a MongoDB collection, typically used to interact with documents in that collection. A Mongoose model is usually created by defining a schema and compiling it into a model. */
        .sort(sort && {price:sort==="asc"?1:-1})
            .limit(limit)
            .skip(skip);//price 1 means sort price on ascending order if -1 then descending order
           //&& ka mtlab ki agar sort hai to ye condition warna phir kuch nhi

           const [products,filteredOnlyProduct]=await Promise.all([
            productsPromise,
            Product.find(baseQuery),
           ]);;//promise all me isliye dala dono ek sath jab ready hoga tab ham age badhege

           const totalPage=Math.ceil(products.length/limit);

    return res.status(200).json({
        success: true,
        products,
        totalPage,
    });
 });


