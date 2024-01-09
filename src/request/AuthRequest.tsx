import axios from "axios";
import { LoginParam, RegisterParam } from "../param/AuthParam";
import LoginResponse from "../response/LoginResponse";
import { UnauthorizedError, UserAlreadyExistsError } from "../error/KepoError";
import BaseResponse from "../response/BaseResponse";
import token from "../lib/Token";
import { BASE_URL } from "../constants/url";

export class AuthRequest{
    login: (param: LoginParam) => Promise<string> = async (param: LoginParam) => {
        const response = await axios.post<BaseResponse>(`${BASE_URL}api/login`, param)
        const code = response.data.code
    
        if (code === 401) {
            throw new UnauthorizedError(response.data.status)
        }
    
        const loginResponse = response.data as LoginResponse
        const savedToken = loginResponse.data.token
        token.saveToken(savedToken)
        return savedToken
    }

    register: (param: RegisterParam) => Promise<string> = async (param: RegisterParam) => {
        const response = await axios.post<BaseResponse>(`${BASE_URL}api/register`, param)
        const code = response.data.code
    
        switch (code) {
            case 409:
                throw new UserAlreadyExistsError(response.data.status);
            default:
                break;
        }

        const loginResponse = response.data as LoginResponse
        const savedToken = loginResponse.data.token
        token.saveToken(savedToken)
        return savedToken
    }
}

const authRequest = new AuthRequest()

export default authRequest;