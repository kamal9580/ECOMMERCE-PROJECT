class ErrorHandler extends Error{

    constructor(public message:string,public statusCode:number) {
        super(message);
        this.statusCode=statusCode;
    }

}

export default ErrorHandler;

//yha ham khud se error ki class bna rahe hai Error me pahle se 3 chiz the aur hame status bhi chahiye the eo ham
//ham khud se bna rahe hai 