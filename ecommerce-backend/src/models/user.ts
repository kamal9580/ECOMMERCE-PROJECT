    
   
import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document{ //these are calles genrics we have to define in typescript

    /* The IUser interface extends the Document interface.
     This suggests that IUser includes all properties and methods defined in the Document interface,
      which is typically used in MongoDB models with Mongoose.*/
      
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;//these are time stamps types
    updatedAt: Date;
    //   Virtual Attribute
    age: number;
}

    const schema = new mongoose.Schema(

        {

        _id: {
            type: String,
            required: [true,"please enter ID"],
        },

        name: {
            type: String,
            required: [true,"please enter Name"],
        },

        email: {
            type: String,
            unique:[true,"email already exist"],
            required: [true,"please enter email"],
            validate:validator.default.isEmail, //ye check karega ki email shi hai ya nhi
        },

        photo: {
            type: String,
            required: [true,"please add photo"],
        },

        role: {
            type: String,
            enum: ["admin", "user"] ,
            default: "user",
        },

        gender: {
            type: String,
            enum: ["male", "female"] ,
            required: [true,"please enter your Gender"],
        },

        dob: {
            type: Date,
       
            required: [true,"please enter your dob"],
        },

    },


        {
            timestamps: true,
        }


    );

    schema.virtual("age").get(function(){
        const today=new Date();
        const dob = this.dob;//this means jo bhi user ka bat ho rha hai upar jo type kiya hai usme uksa dob

        let age=today.getFullYear() - dob.getFullYear();

        if(
            today.getMonth() < dob.getMonth() || 
            (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
         ) {
                age--;
            }

            return age;

            //The code snippet you provided is an example of defining a virtual property in a Mongoose schema. 
            // A virtual property is not stored in the database but is computed on the fly when you access it. 
            // In this case, the virtual property is calculating the age of a user based on their date of birth (dob).
        
            /* schema.virtual("age"): This creates a virtual property named age on the schema.

.get(function() { ... }): This defines a getter function for the age virtual property. The getter function computes the value of the virtual property whenever it is accessed.

const today = new Date();: This creates a new Date object representing the current date and time.

const dob = this.dob;: This accesses the dob (date of birth) property of the current document (the user document). The this keyword refers to the current document instance.

let age = today.getFullYear() - dob.getFullYear();: This calculates the initial age by subtracting the birth year from the current year.

if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) { age--; }: This condition checks if the user's birthday has not occurred yet this year. If the current month is less than the birth month, or if the current month is the same as the birth month but the current date is before the birth date, it decreases the age by 1.

return age;: This returns the computed age. */
    })

    export const User = mongoose.model<IUser>("User",schema);