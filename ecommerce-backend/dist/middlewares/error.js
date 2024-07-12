export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode || (err.statusCode = 500);
    if (err.name === "CastError")
        err.message = "Invalid ID"; // ye hameisliye add kiye ki jab ham order me singleproduct ko 
    //get kar rahe the tab hame agar id shi nhi tha to cast error dikha rha tha isliye hamne aisa likha
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
export const TryCatch = (func) => {
    return (req, res, next) => {
        return Promise.resolve(func(req, res, next)).catch(next);
    };
};
