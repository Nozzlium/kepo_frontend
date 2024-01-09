import axios, { CancelToken } from "axios";
import Question from "../data/Question";
import { QuestionParam, PostQuestionParam } from "../param/QuestionParam";
import QuestionsResponse from "../response/QuestionsResponse";
import networkCall from "./NetworkCall";
import QuestionResponse from "../response/QuestionResponse";
import { NotFoundError, UnauthorizedError } from "../error/KepoError";
import { NOT_FOUND, UNAUTHORIZED } from "../constants/error-code";
import { BASE_URL } from "../constants/url";

class QuestionRequest {
    getFeed: (param: QuestionParam) => Promise<[questions:Question[], page: number]> = async (param: QuestionParam) => {
        const response = await networkCall.get<QuestionsResponse>(`${BASE_URL}api/question`, {params: param})
        const responseData = response.data.data
        return [responseData.questions, responseData.page]
    }
    getById: (id: string, signal?: AbortSignal) => Promise<Question> = async (id: string, signal?: AbortSignal) => {
        const response = await networkCall.get<QuestionResponse>(
            `${BASE_URL}api/question/${id}`,
            { signal: signal }
        )

        if (response.data.code == NOT_FOUND) {
            throw new NotFoundError(response.data.status)
        }

        const question = response.data.data
        return question
    }

    getByUser: (userId: number, param: QuestionParam, signal?: AbortSignal) => Promise<[Question[], number]> = async (userId: number, param: QuestionParam, signal?: AbortSignal) => {
        const url = `${BASE_URL}api/user/${userId}/question`
        const response = await networkCall.get<QuestionsResponse>(url, {
            params: param,
            signal: signal
        })
        const questions = response.data.data.questions
        const page = response.data.data.page
        return [questions, page]
    }

    getLikedByUser: (userId: number, param: QuestionParam, signal?: AbortSignal) => Promise<[Question[], number]> = async (userId: number, param: QuestionParam, signal?: AbortSignal) => {
        const url = `${BASE_URL}api/user/${userId}/question/like`
        const response = await networkCall.get<QuestionsResponse>(url, {
            params: param,
            signal: signal
        })
        const questions = response.data.data.questions
        const page = response.data.data.page
        return [questions, page]
    }

    postQuestion: (param: PostQuestionParam) => Promise<Question> = async (param: PostQuestionParam) => {
        const url = `${BASE_URL}api/question`
        const response = await networkCall.post<QuestionResponse>(url, param)

        if (response.data.code === 401) {
            throw new UnauthorizedError(response.data.status)
        }

        return response.data.data
    }

    edit: (id: number, param: PostQuestionParam) => Promise<Question> = async (id: number, param: PostQuestionParam) => {
        const url = `${BASE_URL}api/question/${id}`
        const response = await networkCall.put<QuestionResponse>(url, param)

        if (response.data.code === 401) {
            throw new UnauthorizedError(response.data.status)
        }

        return response.data.data
    }

    delete: (id: number) => Promise<Question> = async (id: number) => {
        const url = `${BASE_URL}api/question/${id}`
        const response = await networkCall.delete<QuestionResponse>(url)

        if (response.data.code === UNAUTHORIZED) {
            throw new UnauthorizedError(response.data.status)
        }

        return response.data.data
    }
}

const questionRequest = new QuestionRequest()

export default questionRequest