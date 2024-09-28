import assert from "node:assert"

import { AppErrorCode } from "@constants/enums"
import { HttpStatusCode } from "@constants/http"
import AppError from "./app-error"

type AppAssert = (
    condition: any,
    httpStatusCode: HttpStatusCode,
    message: string,
    appErrorCode?: AppErrorCode
) => asserts condition
/**
 * Assertss a condition and throws an AppError when condition is falsy
 */
export const appAssert: AppAssert = (
    condition,
    httpStatusCode,
    message,
    appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode))
