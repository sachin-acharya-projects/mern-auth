import { AccessTokenPayload, verifyToken } from "@utils/token-sign"
import { appAssert } from "@utils/app-assert"
import { AppErrorCode } from "@constants/enums"
import { Http } from "@constants/index"

import { RequestHandler } from "express"

export const authenticate: RequestHandler = (request, response, next) => {
    const accessToken = request.cookies.accessToken as string | undefined
    appAssert(
        accessToken,
        Http.UNAUTHORIZED,
        "Invalid access token. Please check you access token.",
        AppErrorCode.INVALID_ACCESS_TOKEN
    )

    const { error, payload } = verifyToken<AccessTokenPayload>(accessToken)
    appAssert(
        payload,
        Http.UNAUTHORIZED,
        error === "jwt expired"
            ? "Access token has expired. Please refresh the access token."
            : "Invalid access token. Please check you access token.",
        AppErrorCode.INVALID_ACCESS_TOKEN
    )
    request.userid = payload.userid
    request.sessionid = payload.sessionid
    next()
}
