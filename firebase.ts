import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC39amlj6PbTXro8PdZpJ49tu_xN23jZ1c",
  authDomain: "bakalarska-praca-bd1bc.firebaseapp.com",
  projectId: "bakalarska-praca-bd1bc",
  storageBucket: "bakalarska-praca-bd1bc.appspot.com",
  messagingSenderId: "140538802689",
  appId: "1:140538802689:web:30455507f6fa0f68088600",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const FIREBASE_AUTH = getAuth(app);

export { db, app, auth, provider, storage };
