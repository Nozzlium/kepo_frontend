import Answer from "../data/Answer";
import UnauthorizedError from "../error/UnauthorizedError";
import { AnswerParam, PostAnswerParam } from "../param/AnswerParam";
import { AnswersResponse, AnswerResponse } from "../response/AnswersResponse";
import networkCall from "./NetworkCall";

export class AnswerRequest {

    getByQuestion: (questionId: number, param: AnswerParam) => Promise<[Answer[], number]> =  async (questionId: number, param: AnswerParam) => {
        const url = `http://localhost:2637/api/question/${questionId}/answer`        
        const response = await networkCall.get<AnswersResponse>(url, {params: param})
        const responseData = response.data.data
        return [responseData.answers, responseData.page]
    }

    getByUser: (userId: number, param: AnswerParam) => Promise<[Answer[], number]> = async (userId: number, param: AnswerParam) => {
        const url = `http://localhost:2637/api/user/${userId}/answer`
        const response = await networkCall.get<AnswersResponse>(url, {params: param})
        const responseData = response.data.data
        return [responseData.answers, responseData.page]
    }

    postNewAnswer: (param: PostAnswerParam) => Promise<Answer> = async (param: PostAnswerParam) => {
        const url = `http://localhost:2637/api/answer`
        const response = await networkCall.post<AnswerResponse>(url, param)
        const code = response.data.code

        if (code === 401) {
            throw new UnauthorizedError()
        }

        return response.data.data
    }
}

const answerRequest = new AnswerRequest()

export default answerRequest