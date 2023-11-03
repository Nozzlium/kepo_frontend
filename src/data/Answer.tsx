import User from "./User"

interface Answer {
    id: number,
    content: string,
    likes: number,
    isLiked: boolean,
    user: User,
    createdAt: string,
    questionId: number
}

export default Answer