import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvoNOS0Lx3WculUhU55feEijIxB844QvA",
  authDomain: "indi-step.firebaseapp.com",
  projectId: "indi-step",
  storageBucket: "indi-step.firebasestorage.app",
  messagingSenderId: "1037754345200",
  appId: "1:1037754345200:web:df31a9270e1ef931b98435",
  measurementId: "G-EP1JRQW949"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    // Initialize Auth with AsyncStorage persistence
    auth = initializeAuth(app, {
        // @ts-ignore: getReactNativePersistence is available in RN environment but might be missing in some type definitions
        persistence: getReactNativePersistence(AsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}

const db: Firestore = getFirestore(app);

export { auth, db, app };
