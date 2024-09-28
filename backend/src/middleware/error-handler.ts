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
    console.error(`METHOD: ${request.method}; PATH: ${request.path}; Message`)
    if (request.path === Constants.REFRESH_PATH) clearAuthCookies(response)

    if (error instanceof ZodError) {
        console.error(`${error.name} ${error.message}`)
        handleZodError(response, error)
        return
    } else if (error instanceof AppError) {
        console.error(
            `Application Error\nStatusCode:\t ${error.status_code}\nMessage:\t ${error.message}`
        )
        handleAppError(response, error)
        return
    } else if (error instanceof Error) {
        console.error(`${error.name} ${error.message}`)
    } else console.error(error)

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
