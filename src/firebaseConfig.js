import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCF3_uFnNRr1uLN3ZIzwUhNjYhq_u_sCsM",
  authDomain: "wedding-invite-3b188.firebaseapp.com",
  projectId: "wedding-invite-3b188",
  storageBucket: "wedding-invite-3b188.firebasestorage.app",
  messagingSenderId: "101943601741",
  appId: "1:101943601741:web:03d98a04143db073954a04",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, storageRef, uploadBytesResumable, getDownloadURL, db, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot };