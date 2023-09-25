import axios, { AxiosHeaders, AxiosInstance } from "axios";
import token from "../lib/Token";

const initNetworkCall: () => AxiosInstance = () => {
    return axios.create()
}

const networkCall: AxiosInstance = initNetworkCall()

export default networkCall