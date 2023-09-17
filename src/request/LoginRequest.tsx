import axios from "axios";
import LoginParam from "../param/LoginParam";
import LoginResponse from "../response/LoginResponse";
import UnauthorizedError from "../error/UnauthorizedError";
import BaseResponse from "../response/BaseResponse";
import token from "../helper/Token";

export class LoginRequest{
    login: (param: LoginParam) => Promise<string> = async (param: LoginParam) => {
        const response = await axios.post<BaseResponse>(`http://localhost:2637/api/login`, param)
        const code = response.data.code
    
        if (code === 401) {
            throw new UnauthorizedError()
        }
    
        const loginResponse = response.data as LoginResponse
        const savedToken = loginResponse.data.token
        token.saveToken(savedToken)
        return savedToken
    }
}

const loginRequest = new LoginRequest()

export default loginRequest;