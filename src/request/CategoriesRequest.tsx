import { CancelToken } from "axios"
import Category from "../data/Category"
import CategoriesResponse from "../response/CategoriesResponse"
import networkCall from "./NetworkCall"

export class CategoriesRequest {
    getCategories: (signal?: AbortSignal) => Promise<Category[]> = async (signal?: AbortSignal) => {
        const response = await networkCall.get<CategoriesResponse>('http://localhost:2637/api/category', {
            signal: signal
        })
        return response.data.data
    }
}

const categoriesRequest = new CategoriesRequest()

export default categoriesRequest