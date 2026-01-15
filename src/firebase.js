// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // <-- 1. EKLENDİ

const firebaseConfig = {
  apiKey: "AIzaSyCBgAtr9BWW4UqSOA2oc_DR23FfQ3LdRB0",
  authDomain: "project-62179159490816488.firebaseapp.com",
  projectId: "project-62179159490816488",
  storageBucket: "project-62179159490816488.firebasestorage.app",
  messagingSenderId: "784023232021",
  appId: "1:784023232021:web:65a951721a1dd2be51381c",
  measurementId: "G-0YHZ1BZCL3"
};

// Firebase'i başlatıyoruz
const app = initializeApp(firebaseConfig);

// Giriş işlemleri için 'auth'u dışarı aktarıyoruz
export const auth = getAuth(app);

// Veritabanı işlemleri için 'db'yi dışarı aktarıyoruz
export const db = getFirestore(app); // <-- 2. EKLENDİ