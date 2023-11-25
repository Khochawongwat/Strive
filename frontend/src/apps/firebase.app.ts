import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../configs/firebase.config";

export const firebaseApp = initializeApp(firebaseConfig)