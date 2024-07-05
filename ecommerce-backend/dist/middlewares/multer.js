/*  Multer is a middleware for handling multipart/form-data, which is primarily used for uploading files in Node.js and Express.js applications.
 It makes it easy to handle file uploads from forms in a web application.
 
 yha par disk storage means kha store hoga aur .single jo photo ham access karna chahte hai wo hame mil jayegi
 
 
 */
import multer from "multer";
import { v4 as uuid } from 'uuid'; //it helps to generate random id for photo
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads"); //null yha par error hai agar error nhi ahai tab kha uploads karna hai
    },
    filename(req, file, callback) {
        const id = uuid();
        const extName = file.originalname.split(".").pop(); //database jo photo ka nam hai uska last wala elment accesss kiye pop use karke aur uska nam change kar diye
        callback(null, `${id}.${extName}`);
    },
});
export const singleUpload = multer({ storage }).single("photo");
