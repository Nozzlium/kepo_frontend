export class KepoError extends Error {
    message: string
    constructor(name: string, message: string) {
        super(message)
        this.name = name
        this.message = message
    }
}

export class UnauthorizedError extends KepoError {
    constructor(message: string) {
        super("UnauthorizedError", message)
    }
}

export class UserAlreadyExistsError extends KepoError {
    constructor(message: string) {
        super("UserAlreadyExistsError", message)
    }
}