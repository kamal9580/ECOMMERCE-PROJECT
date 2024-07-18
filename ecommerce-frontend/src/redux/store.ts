import {configureStore} from "@reduxjs/toolkit";


export const server = import.meta.env.VITE_SERVER;
// in store.ts this we store the backend server

export const store = configureStore({

    reducer: {},
    //this reducer help to change the value the state
});