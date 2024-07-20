import { initializeApp } from "firebase/app"
import "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyDwAdULoNPSFWd21S4j_IRrEizWq-icKHY",
    authDomain: "medifyai-3a740.firebaseapp.com",
    projectId: "medifyai-3a740",
    storageBucket: "medifyai-3a740.appspot.com",
    messagingSenderId: "719599552276",
    appId: "1:719599552276:web:f35cd2566c147584896401"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export default app