import axios from "axios"

const api = axios.create({
    baseURL: "https://api-uni-digital.herokuapp.com:443/"
    //baseURL: "http://192.168.56.1:80/"
})

export default api;