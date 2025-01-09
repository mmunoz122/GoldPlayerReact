import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importa els components amb majúscules
import LoginScreen from './components/Screens/LoginScreen';
import FavouritesScreen from './components/Screens/FavouritesScreen';
import ListScreen from './components/Screens/ListScreen';
import NewVideoScreen from './components/Screens/NewVideoScreen';
import UserScreen from './components/Screens/UserScreen';
import RegisterScreen from './components/Screens/RegisterScreen';

// Importa el CSS des d'un directori general d'estils
import './components/Screens/App.css';

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta base: redirigeix a /login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Rutes de l'aplicació */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/new-video" element={<NewVideoScreen />} />
          <Route path="/favourites" element={<FavouritesScreen />} />
          <Route path="/list" element={<ListScreen />} />
          <Route path="/user" element={<UserScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* Ruta per a pàgines no trobades */}
          <Route path="*" element={<h1>Pàgina no trobada</h1>} />
        </Routes>
      </div>
    </Router>
  );
}
