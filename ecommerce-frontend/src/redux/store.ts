import {configureStore} from "@reduxjs/toolkit";
import { productAPI } from "./api/productApi";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";




export const server = import.meta.env.VITE_SERVER;
// in store.ts this we store the backend server

export const store = configureStore({

    reducer: {
        [userAPI.reducerPath] : userAPI.reducer,
        [productAPI.reducerPath] : productAPI.reducer,

        [userReducer.name] : userReducer.reducer,
    },

    // middleware: (mid) => [...mid(),userAPI.middleware],
    //this reducer help to change the value the state
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userAPI.middleware,
            productAPI.middleware
        ),
});