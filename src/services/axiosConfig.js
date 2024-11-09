import axios from 'axios';
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

console.log(URL_SERVER);

// Configuramos por defecto nuestra direccion del server
const axiosInstance = axios.create({
    baseURL : URL_SERVER,
    headers: {
        'Content-Type': 'application/json'
    }
});

// axiosInstance.interceptors.request.use((config)=>{
//     const token = localStorage.getItem('token'); // Recupera el token del almacenamiento local
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`; // Agrega el token al encabezado de autorización
//     }
//     return config;
// }, (error) => Promise.reject(error));

export default axiosInstance;