import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmkwoOvnUozmLJAQrzJWwJC6BVffAwYuk",
  authDomain: "fit-foods-4b953.firebaseapp.com",
  projectId: "fit-foods-4b953",
  storageBucket: "fit-foods-4b953.appspot.com",
  messagingSenderId: "938404511120",
  appId: "1:938404511120:web:33d65313a8b5f3c9858715",
};

initializeApp(firebaseConfig);
export default getFirestore();
