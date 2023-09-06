import Question from "../data/Question";

interface QuestionResponse {
    code: number,
    status: string,
    data: Question
}

export default QuestionResponse