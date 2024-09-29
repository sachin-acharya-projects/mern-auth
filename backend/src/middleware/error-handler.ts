import { ErrorRequestHandler } from "express"
import { ZodError } from "zod"
import AppError from "@utils/app-error"

import { Http, Constants } from "@constants/index"
import { clearAuthCookies } from "@utils/cookies"

export const errorHandler: ErrorRequestHandler = (
    error,
    request,
    response,
    next
) => {
    console.error(
        `METHOD: ${request.method}\nPATH: ${
            request.path
        }\nDate: ${new Date().toLocaleString()}\nMESSAGE:`
    )
    if (request.path === Constants.REFRESH_PATH) clearAuthCookies(response)

    if (error instanceof ZodError) {
        console.error(`${error.name} ${error.message}\n`)
        handleZodError(response, error)
        return
    } else if (error instanceof AppError) {
        console.error(`${error.message} (HTTP/${error.status_code})\n`)
        handleAppError(response, error)
        return
    } else if (error instanceof Error) {
        console.error(`${error.name} ${error.message}\n`)
    } else console.error(error, "\n")
    response.status(Http.INTERNAL_SERVER_ERROR).json(Http.getMessage(500))
    return
}

function handleZodError(response: Global.Response, error: ZodError) {
    const errors = error.issues.map((err) => ({
        path: err.path.join(", "),
        message: err.message,
    }))
    response.status(Http.BAD_REQUEST).json({
        subject: "Validation Failed",
        errors,
    })
}

function handleAppError(response: Global.Response, error: AppError) {
    response.status(error.status_code).json({
        message: error.message,
        error_code: error.error_code,
    })
}
