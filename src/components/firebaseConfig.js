// Importem les funcions necessàries des del SDK de Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configurarem Firebase amb les credencials del projecte
const firebaseConfig = {
  apiKey: "AIzaSyBtvar0Dkt40bfe8Ee4Hf4GLdZPsxM52ds", // Clau API del projecte
  authDomain: "mastervideo-6be22.firebaseapp.com", // Domini d'autenticació
  projectId: "mastervideo-6be22", // ID del projecte a Firestore
  storageBucket: "mastervideo-6be22.appspot.com", // Espai d'emmagatzematge
  messagingSenderId: "643958523627", // ID del servei de missatgeria
  appId: "1:643958523627:web:0b54a1fa361d71d3ab20ae" // Identificador de l'aplicació
};

// Inicialitzarem l'aplicació de Firebase
const app = initializeApp(firebaseConfig);

// Inicialitzarem els serveis d'Autenticació i Firestore
const auth = getAuth(app); // Crearem el servei d'autenticació
const db = getFirestore(app); // Crearem el servei de base de dades Firestore

// Exportarem els serveis per utilitzar-los en altres parts de l'aplicació
export { auth, db };
