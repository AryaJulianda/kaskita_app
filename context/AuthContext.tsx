// import { auth, firestore } from "@/config/firebase";
// import { AuthContextType, UserType } from "@/types";
// import { useRouter } from "expo-router";
// import {
//   createUserWithEmailAndPassword,
//   onAuthStateChanged,
//   signInWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import React, { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<UserType>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         setUser({
//           uid: firebaseUser?.uid,
//           email: firebaseUser?.email,
//           name: firebaseUser?.displayName,
//         });
//         updateUserData(firebaseUser.uid)
//         router.replace("/(tabs)");
//       } else {
//         setUser(null);
//         router.replace("/(auth)/welcome");
//       }
//       console.log("firebase user:", firebaseUser);
//     });

//     return () => unsub();
//   }, []);

//   const contextValue: AuthContextType = {
//     user,
//     setUser,
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be wrapped inside AuthProvider");
//   }

//   return context;
// };
