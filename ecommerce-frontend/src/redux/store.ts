import {configureStore} from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";


export const server = import.meta.env.VITE_SERVER;
// in store.ts this we store the backend server

export const store = configureStore({

    reducer: {
        [userAPI.reducerPath] : userAPI.reducer,
    },

    // middleware: (mid) => [...mid(),userAPI.middleware],
    //this reducer help to change the value the state
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userAPI.middleware),
});