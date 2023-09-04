import axios from "axios";


export const URL = axios.create({
    baseURL: 'https://feelfreebe.onrender.com/'
    // baseURL: 'https://localhost:4000/'
})