import axios from "axios"

const api = axios.create({
    baseURL: "https://api-uni-digital.herokuapp.com:443/"
    //baseURL: "http://192.168.0.59:80/"   // Fortaleza
    //baseURL: "http://192.168.0.59:80/"  // Caucaia
})

export default api;