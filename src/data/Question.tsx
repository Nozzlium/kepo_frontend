import Category from "./Category"
import User from "./User"

interface Question {
    id: number,
    content: string,
    description: string,
    likes: number,
    answers: number,
    isLiked: boolean,
    user: User,
    category: Category,
    createdAt: string,
    isEdited: boolean
}

export default Question