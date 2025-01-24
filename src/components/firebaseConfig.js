// Importar los servicios necesarios de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa Storage

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtvar0Dkt40bfe8Ee4Hf4GLdZPsxM52ds",
  authDomain: "mastervideo-6be22.firebaseapp.com",
  databaseURL: "https://mastervideo-6be22-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "mastervideo-6be22",
  storageBucket: "mastervideo-6be22.firebasestorage.app",
  messagingSenderId: "643958523627",
  appId: "1:643958523627:web:0b54a1fa361d71d3ab20ae",
  measurementId: "G-7XFSG58FQT"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios una sola vez
export const auth = getAuth(app); // Solo una vez
export const db = getFirestore(app);
export const storage = getStorage(app); // Exportar Storage
