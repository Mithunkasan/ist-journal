import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-B6KS04BdSgTjThTGb-HoZyxawsorfdQ",
  authDomain: "jounal-online-afcd8.firebaseapp.com",
  projectId: "jounal-online-afcd8",
  storageBucket: "jounal-online-afcd8.appspot.com",
  messagingSenderId: "794742039783",
  appId: "1:794742039783:web:e7e9f623ab9cc5f948ee42",
  measurementId: "G-Z0C5STXMED",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
