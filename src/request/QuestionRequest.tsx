import axios from "axios";
import Question from "../data/Question";
import { QuestionParam, PostQuestionParam } from "../param/QuestionParam";
import QuestionsResponse from "../response/QuestionsResponse";
import networkCall from "./NetworkCall";
import QuestionResponse from "../response/QuestionResponse";

class QuestionRequest {
    getFeed: (param: QuestionParam) => Promise<[questions:Question[], page: number]> = async (param: QuestionParam) => {
        const response = await networkCall.get<QuestionsResponse>('http://localhost:2637/api/question', {params: param})
        const responseData = response.data.data
        return [responseData.questions, responseData.page]
    }
    getById: (id: string) => Promise<Question> = async (id: string) => {
        const response = await networkCall.get<QuestionResponse>(`http://localhost:2637/api/question/${id}`)
        const question = response.data.data
        return question
    }

    getByUser: (userId: number, param: QuestionParam) => Promise<[Question[], number]> = async (userId: number, param: QuestionParam) => {
        const url = `http://localhost:2637/api/user/${userId}/question`
        const response = await networkCall.get<QuestionsResponse>(url, {params: param})
        const questions = response.data.data.questions
        const page = response.data.data.page
        return [questions, page]
    }

    postQuestion: (param: PostQuestionParam) => Promise<Question> = async (param: PostQuestionParam) => {
        const url = `http://localhost:2637/api/question`
        const response = await networkCall.post<QuestionResponse>(url, param)
        return response.data.data
    }
}

const questionRequest = new QuestionRequest()

export default questionRequest