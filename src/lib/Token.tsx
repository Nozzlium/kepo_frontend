import NoTokenError from "../error"
import networkCall from "../request/NetworkCall"

export class Token {

    setToken: (token: string | null) => void = (token) => {
        if (token !== null) {
            networkCall.defaults.headers.common["Authorization"] = `Bearer ${token}`
            this.saveToken(token)
        }
    }

    discardToken: () => void = () => {
        delete networkCall.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
    }

    saveToken: (token: string) => void = (token) => {
        localStorage.setItem('token', token)
    }
    
    getToken: () => string | null = () => {
        const token = localStorage.getItem('token')
        return token
    }

}

const token = new Token()

export default token