
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";//firebase se getauth liya


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);//aur get auth ko app chahiye


 //firebase ham isliye hai dale hai ki taki ham google auth use kar sake aur firebase ki yhi best bat hai ki hame alag se 
 //api google auth ki nhi bnani padti hai 