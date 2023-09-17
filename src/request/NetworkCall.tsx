import axios, { AxiosHeaders, AxiosInstance } from "axios";
import token from "../helper/Token";

const initNetworkCall: () => AxiosInstance = () => {
    return axios.create()
}

const networkCall: AxiosInstance = initNetworkCall()

export default networkCall