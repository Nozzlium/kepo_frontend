import Question from "../data/Question"

interface QuestionsData {
    page: number,
    pageSize: number,
    questions: Question[]
}

interface QuestionsResponse {
    code: number,
    status: string,
    data: QuestionsData
}

export default QuestionsResponse