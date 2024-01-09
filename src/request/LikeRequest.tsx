import { UNAUTHORIZED } from "../constants/error-code";
import { BASE_URL } from "../constants/url";
import Answer from "../data/Answer";
import Question from "../data/Question";
import { UnauthorizedError } from "../error/KepoError";
import { AnswerLikeParam, QuestionLikeParam } from "../param/LikeParam";
import { AnswerResponse } from "../response/AnswersResponse";
import QuestionResponse from "../response/QuestionResponse";
import networkCall from "./NetworkCall";

class LikeRequest {

    likeQuestion: (param: QuestionLikeParam) => Promise<Question> = async (param: QuestionLikeParam) => {
        const response = await networkCall.post<QuestionResponse>(`${BASE_URL}api/question/like`, param)
        const responseData = response.data
        
        if (responseData.code === UNAUTHORIZED) {
            throw new UnauthorizedError(responseData.status)
        }
        
        return responseData.data
    }

    likeAnswer: (param: AnswerLikeParam) => Promise<Answer> = async (param: AnswerLikeParam) => {
        const response = await networkCall.post<AnswerResponse>(`${BASE_URL}api/answer/like`, param)
        const responseData = response.data

        if (responseData.code === UNAUTHORIZED) {
            throw new UnauthorizedError(responseData.status)
        }

        return responseData.data
    }

}

const likeRequest = new LikeRequest()

export default likeRequest