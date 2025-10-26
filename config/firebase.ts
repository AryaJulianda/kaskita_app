// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADI_qK_GJ2rfO3sdQ0VDzd30fxABSENZU",
  authDomain: "kaskita-d2d2c.firebaseapp.com",
  projectId: "kaskita-d2d2c",
  storageBucket: "kaskita-d2d2c.firebasestorage.app",
  messagingSenderId: "995599594595",
  appId: "1:995599594595:web:913895b39360e2cf1d7456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
