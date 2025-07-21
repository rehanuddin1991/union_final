import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAA7psUg-IBaxsJKODT7AMj0PieOZi0ZaU",
  authDomain: "ramgarhunion-ff752.firebaseapp.com",
  projectId: "ramgarhunion-ff752",
  storageBucket: "ramgarhunion-ff752.firebasestorage.app",
  messagingSenderId: "488283456993",
  appId: "1:488283456993:web:3588ac7a8d0d1cc68e7ea0",
  measurementId: "G-5FY5GLM62Z"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };