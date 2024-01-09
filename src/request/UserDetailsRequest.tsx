import User from "../data/User";
import BaseResponse from "../response/BaseResponse";
import token from "../lib/Token";
import NoTokenError from "../error";
import { UnauthorizedError } from "../error/KepoError";
import UserResponse from "../response/UserResponse";
import networkCall from "./NetworkCall";
import { CancelToken } from "axios";
import { BASE_URL } from "../constants/url";

export class UserDetailsRequest {
    getDetails: (signal?: AbortSignal) => Promise<User> = async (signal?: AbortSignal) => {
        const response = await networkCall.get<BaseResponse>(`${BASE_URL}api/details`, {
            signal: signal
        })

            if (response.data.code === 401) {
                throw new UnauthorizedError(response.data.status)
            }

            const userResponse = response.data as UserResponse
            return userResponse.data
    }

    getDetailsById: (userId: number, signal?: AbortSignal) => Promise<User> = async (userId: number, signal?: AbortSignal) => {
        const response = await networkCall.get<BaseResponse>(`${BASE_URL}api/user/${userId}/details`, {
            signal: signal
        })

        const userResponse = response.data as UserResponse
        return userResponse.data
    }
}

const userDetailRequest = new UserDetailsRequest()

export default userDetailRequest