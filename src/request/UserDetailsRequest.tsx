import User from "../data/User";
import BaseResponse from "../response/BaseResponse";
import token from "../helper/Token";
import NoTokenError from "../error";
import UnauthorizedError from "../error/UnauthorizedError";
import UserResponse from "../response/UserResponse";
import networkCall from "./NetworkCall";

export class UserDetailsRequest {
    getDetails: () => Promise<User> = async () => {
        try {
            const response = await networkCall.get<BaseResponse>('http://localhost:2637/api/details')

            if (response.data.code === 401) {
                throw new UnauthorizedError()
            }

            const userResponse = response.data as UserResponse
            return userResponse.data
        } catch (error) {
            if (error instanceof NoTokenError) {
                throw new UnauthorizedError()
            }
            throw error
        }
    }

    getDetailsById: (userId: number) => Promise<User> = async (userId: number) => {
        const response = await networkCall.get<BaseResponse>(`http://localhost:2637/api/user/${userId}/details`)

        const userResponse = response.data as UserResponse
        return userResponse.data
    }
}

const userDetailRequest = new UserDetailsRequest()

export default userDetailRequest