import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa'; // Usamos react-icons para los iconos

// Crearem el component FButton amb opcions seleccionades i no seleccionades
export default function FButton({ 
    selectedIcon, // Icona per a l'estat seleccionat
    unselectedIcon, // Icona per a l'estat no seleccionat
    id, // Identificador del botó
    isSelected, // Estat de selecció
    onPress // Funció per gestionar el clic
}) {
    return (
        // Configurarem el botó per detectar el clic
        <div onClick={() => onPress(id)} style={styles.buttonContainer}>
            <div style={styles.iconContainer}>
                {/* Mostrarem la icona segons l'estat */}
                {isSelected ? (
                    <selectedIcon size={50} color="white" style={styles.icon} />
                ) : (
                    <unselectedIcon size={50} color="white" style={styles.icon} />
                )}
                {isSelected ? "Selected" : "Not Selected"} {/* Mostramos el estado de selección */}
            </div>
        </div>
    );
}

// Estils per al component (CSS en línia o estilos de objetos en JS)
const styles = {
    buttonContainer: {
        textAlign: 'center', // Centraremos el contenedor
        cursor: 'pointer', // Añadimos un cursor de mano para indicar que es clickeable
    },
    iconContainer: {
        display: 'flex',
        justifyContent: 'center', // Centraremos la icona dins del contenidor
        alignItems: 'center',
    },
    icon: {
        margin: 10, // Agregamos un margen alrededor de la icona
    },
};
