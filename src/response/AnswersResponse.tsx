import Answer from "../data/Answer";

interface AnswersData {
    page: number,
    pageSize: number,
    answers: Answer[]
}

export interface AnswersResponse {
    code: number,
    status: string,
    data: AnswersData
}

export interface AnswerResponse {
    code: number,
    status: string,
    data: Answer
}