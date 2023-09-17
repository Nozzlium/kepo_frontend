import User from "../data/User";
import BaseResponse from "./BaseResponse";

interface UserResponse extends BaseResponse {
    data: User  
}

export default UserResponse