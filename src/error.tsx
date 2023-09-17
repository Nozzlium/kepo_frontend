class NoTokenError extends Error {
    constructor() {
        super('No auth token found')
        this.name = "NoTokenError"
    }
}

export default NoTokenError