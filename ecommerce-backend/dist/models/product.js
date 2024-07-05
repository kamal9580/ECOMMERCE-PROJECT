import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter Name"],
    },
    photo: {
        type: String,
        required: [true, "please enter photo"],
    },
    price: {
        type: Number,
        required: [true, "please enter price"],
    },
    stock: {
        type: Number,
        required: [true, "please enter stock"],
    },
    category: {
        type: String,
        required: [true, "please enter product category"],
        trim: true, //iska mtlab white space remove kar diya
    },
}, {
    timestamps: true,
});
export const Product = mongoose.model("Product", schema);
