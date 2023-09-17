export interface QuestionParam {
    keyword?: string,
    pageNo?: number,
    pageSize?: number,
    category?: number
}

export interface PostQuestionParam {
    categoryId: number,
    content: string,
    description: string
}