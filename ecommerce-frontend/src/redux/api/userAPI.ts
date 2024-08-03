
import { createApi, fetchBaseQuery,  } from "@reduxjs/toolkit/query/react";
// import { server } from "../store";
import { MessageResponse } from "../../types/api-types";
import { User } from "../../types/types";



export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({baseUrl: `${ import.meta.env.VITE_SERVER}/api/v1/user/`}),
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse,User>({
            //ye jo upar type decide kiye hai login me User wo hai jo ham login karte smay bhejhte hai
            //User me uska type decide kiya hai aur ye jo return krega wo MessageResponse me decide kiye hai
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,//user ke == User hai
            }),
        }),
    }),
});


// useLoginMutation this is a hook

export const { useLoginMutation }= userAPI;