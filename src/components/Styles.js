export const styles = {
  backgroundImage: {
    backgroundSize: 'cover', // Ajustar el tamaño de la imagen para cubrir toda la pantalla
    backgroundPosition: 'center', // Centrar la imagen
    minHeight: '100vh', // Asegura que la imagen cubra toda la pantalla
    width: '100%', // Asegura que el fondo cubra toda la anchura
    position: 'fixed', // Asegura que el fondo esté fijo
    top: 0,
    left: 0,
    zIndex: -1, // Coloca el fondo detrás de todos los demás elementos
  },
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Asegura que el contenedor cubra toda la pantalla
    padding: '20px',
    position: 'relative', // Permite que los elementos se posicionen por encima del fondo
  },
  formContainer: {
    backgroundColor: 'rgba(211, 211, 211, 0.9)', // Gris claro con algo de transparencia
    padding: '50px', // Reducción del padding
    borderRadius: '40px',
    width: '500px', // Reducir el tamaño del formulario
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra suave
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1, // Asegura que el formulario esté por encima del fondo
  },
  logo: {
    width: '100px', // Reducir el tamaño del logo
    marginBottom: '20px', // Menos espacio entre el logo y el formulario
  },
  headerButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '15px', // Menos espacio entre los botones de la cabecera
  },
  headerButton: {
    backgroundColor: '#b3b3b3', // Gris més fosc
    color: 'white',
    padding: '8px 15px', // Reducción de tamaño en los botones
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px', // Reducir el tamaño de la fuente
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Afegir sombra
  },
  headerButtonSelected: {
    backgroundColor: 'red', // Botó seleccionat en vermell
  },
  title: {
    color: 'black',
    fontSize: '20px', // Reducir el tamaño del título
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: '15px', // Menos espacio debajo del título
  },
  errorText: {
    color: 'red',
    marginBottom: '10px', // Menos espacio debajo del mensaje de error
  },
  input: {
    width: '100%',
    padding: '8px', // Reducir el padding
    marginBottom: '12px', // Menos espacio entre los inputs
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px', // Reducir el tamaño de la fuente
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  link: {
    marginTop: '10px',
    color: 'orange', // Groc per al text
    fontWeight: 'bold', // Negreta
    cursor: 'pointer',
    textDecoration: 'none',
  },
};
