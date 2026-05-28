import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBgAtr9BWW4UqSOA2oc_DR23FfQ3LdRB0",
  authDomain: "project-62179159490816488.firebaseapp.com",
  projectId: "project-62179159490816488",
  storageBucket: "project-62179159490816488.firebasestorage.app",
  messagingSenderId: "784023232021",
  appId: "1:784023232021:web:65a951721a1dd2be51381c",
  measurementId: "G-0YHZ1BZCL3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);