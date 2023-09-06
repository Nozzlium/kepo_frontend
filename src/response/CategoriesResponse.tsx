import Category from "../data/Category";

interface CategoriesResponse {
    code: number,
    status: string,
    data: Category[]
}

export default CategoriesResponse