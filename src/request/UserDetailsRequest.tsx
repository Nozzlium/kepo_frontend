import User from "../data/User";
import BaseResponse from "../response/BaseResponse";
import token from "../lib/Token";
import NoTokenError from "../error";
import { UnauthorizedError } from "../error/KepoError";
import UserResponse from "../response/UserResponse";
import networkCall from "./NetworkCall";

export class UserDetailsRequest {
    getDetails: () => Promise<User> = async () => {
        const response = await networkCall.get<BaseResponse>('http://localhost:2637/api/details')

            if (response.data.code === 401) {
                throw new UnauthorizedError(response.data.status)
            }

            const userResponse = response.data as UserResponse
            return userResponse.data
    }

    getDetailsById: (userId: number) => Promise<User> = async (userId: number) => {
        const response = await networkCall.get<BaseResponse>(`http://localhost:2637/api/user/${userId}/details`)

        const userResponse = response.data as UserResponse
        return userResponse.data
    }
}

const userDetailRequest = new UserDetailsRequest()

export default userDetailRequest