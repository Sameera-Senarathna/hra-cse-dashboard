import Axios from "axios";

const axiosInstance = Axios.create({
    baseURL: "http://localhost:3004",
    headers: {},
    timeout: 4000
});

export default axiosInstance;