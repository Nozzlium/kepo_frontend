import axios, { AxiosHeaders, AxiosInstance } from "axios";

const initNetworkCall: () => AxiosInstance = () => {
    return axios.create()
}

const networkCall: AxiosInstance = initNetworkCall()

export default networkCall