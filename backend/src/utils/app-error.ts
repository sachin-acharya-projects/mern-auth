import { AppErrorCode } from "@constants/enums"
import { HttpStatusCode } from "@constants/http"

export default class AppError extends Error {
    constructor(
        public status_code: HttpStatusCode,
        public message: string,
        public error_code?: AppErrorCode
    ) {
        super(message)
    }
}