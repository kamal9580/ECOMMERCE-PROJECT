class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
export default ErrorHandler;
//yha ham khud se error ki class bna rahe hai Error me pahle se 3 chiz the aur hame status bhi chahiye the eo ham
//ham khud se bna rahe hai 
