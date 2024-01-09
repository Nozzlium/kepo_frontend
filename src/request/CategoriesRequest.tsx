import { CancelToken } from "axios"
import Category from "../data/Category"
import CategoriesResponse from "../response/CategoriesResponse"
import networkCall from "./NetworkCall"
import { BASE_URL } from "../constants/url"

export class CategoriesRequest {
    getCategories: (signal?: AbortSignal) => Promise<Category[]> = async (signal?: AbortSignal) => {
        const response = await networkCall.get<CategoriesResponse>(`${BASE_URL}api/category`, {
            signal: signal
        })
        return response.data.data
    }
}

const categoriesRequest = new CategoriesRequest()

export default categoriesRequest