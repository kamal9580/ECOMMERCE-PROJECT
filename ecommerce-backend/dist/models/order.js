import mongoose from "mongoose";
const schema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        pinCode: {
            type: Number,
            required: true,
        },
    },
    user: {
        type: String,
        ref: "User", //basically hame isme id deni hai
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Delivered"],
        default: "Processing",
    },
    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId, /* type: Specifies the type of the field. Here, mongoose.Types.ObjectId indicates that the productId field will store MongoDB's ObjectId.

                ref: Specifies the model to which the ObjectId refers. In this case, "Product" tells Mongoose that productId refers to documents in the "Product" collection/model.*/
                ref: "Product",
            },
        },
    ],
}, {
    timestamps: true,
});
export const Order = mongoose.model("Order", schema);
