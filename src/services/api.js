const API_URL = 'https://api-react-taller-production.up.railway.app';

// Una sola función para todas las llamadas
export async function llamarAPI(endpoint, metodo = 'GET', datos = null) {
  const token = localStorage.getItem('token');
  
  const opciones = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (datos) {
    opciones.body = JSON.stringify(datos);
  }

  const respuesta = await fetch(`${API_URL}${endpoint}`, opciones);
  return await respuesta.json();
}