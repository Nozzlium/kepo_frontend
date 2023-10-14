export interface AnswerParam {
    pageNo?: number,
    pageSize?: number,
    sortBy?: string,
    order?: string
}

export interface PostAnswerParam {
    questionId: number,
    content: string
}