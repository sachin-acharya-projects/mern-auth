export const OK = 200
export const CREATED = 201
export const BAD_REQUEST = 400
export const UNAUTHORIZED = 401
export const FORBIDDEN = 403
export const NOT_FOUND = 404
export const CONFLICT = 409
export const UNPROCESSABLE_CONTENT = 422
export const TOO_MANY_REQUESTS = 429
export const INTERNAL_SERVER_ERROR = 500

export type HttpStatusCode =
    | typeof OK
    | typeof CREATED
    | typeof BAD_REQUEST
    | typeof UNAUTHORIZED
    | typeof FORBIDDEN
    | typeof NOT_FOUND
    | typeof CONFLICT
    | typeof UNPROCESSABLE_CONTENT
    | typeof TOO_MANY_REQUESTS
    | typeof INTERNAL_SERVER_ERROR

export function getMessage(
    status_code: HttpStatusCode
): {
    subject: string
    message: string
} {
    switch (status_code) {
        case 200:
            return {
                message:
                    "Your request was successful! Everything is working as expected.",
                subject: "Success!",
            }

        case 201:
            return {
                message:
                    "Your request has been successfully created! Thank you for submitting.",
                subject: "Created Successfully!",
            }

        case 400:
            return {
                message:
                    "It looks like there was an issue with your request. Please check and try again.",
                subject: "Bad Request",
            }

        case 401:
            return {
                message:
                    "You are not authorized to access this resource. Please log in and try again.",
                subject: "Unauthorized Access",
            }

        case 403:
            return {
                message:
                    "You don't have permission to access this resource. If this is an error, please contact support.",
                subject: "Forbidden",
            }

        case 404:
            return {
                message:
                    "We couldn't find what you're looking for. The page or resource may have been moved or deleted.",
                subject: "Page Not Found",
            }

        case 409:
            return {
                message:
                    "There seems to be a conflict with your request. Please resolve the conflict and try again.",
                subject: "Conflict Detected",
            }

        case 422:
            return {
                message:
                    "We couldn't process your request due to invalid data. Please check and resubmit.",
                subject: "Unprocessable Entity",
            }

        case 429:
            return {
                message:
                    "You're making requests too quickly! Please slow down and try again later.",
                subject: "Too Many Requests",
            }

        case 500:
            return {
                message:
                    "We're experiencing a technical issue on our end. Please try again in a few moments.",
                subject: "Technical Issue",
            }

        default:
            return {
                message:
                    "An unexpected error has occurred. Please try again later.",
                subject: "Error",
            }
    }
}
