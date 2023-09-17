import BaseResponse from "./BaseResponse"

interface TokenData {
    token: string
}

interface LoginResponse extends BaseResponse{
    data: TokenData
}

export default LoginResponse