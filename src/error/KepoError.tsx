export class KepoError extends Error {
    message: string
    constructor(name?: string, message?: string) {
        super(message)
        this.name = name ?? "KepoError"
        this.message = message ?? "Terjadi Error"
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

export class NotFoundError extends KepoError {
    constructor(message: string) {
        super("NotFoundError", message)
    }
}