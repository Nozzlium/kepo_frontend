import Answer from "../data/Answer";

interface AnswersData {
    page: number,
    pageSize: number,
    answers: Answer[]
}

interface AnswersResponse {
    code: number,
    status: string,
    data: AnswersData
}

export default AnswersResponse