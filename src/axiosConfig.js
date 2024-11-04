import axios from 'axios';
const URL_SERVER = import.meta.env.VITE_URL_SERVER; //Url de nuestro server

console.log(URL_SERVER)

// Configuramos por defecto nuestra direccion del server
const axiosInstance = axios.create({
    baseURL : URL_SERVER,
});
export default axiosInstance;