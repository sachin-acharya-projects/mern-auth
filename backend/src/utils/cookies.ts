import { xDaysFromNow, xMinutesFromNow } from "@utils/date"
import { DEBUG } from "@constants/config"
import { REFRESH_PATH } from "@constants/constants"

import { CookieOptions } from "express"

const secure = !DEBUG
const defaults: CookieOptions = {
    sameSite: "strict",
    httpOnly: true,
    secure,
}

export const getAccessTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: xMinutesFromNow(15),
})
export const getRefreshTokenCookieOptions = (): CookieOptions => ({
    ...defaults,
    expires: xDaysFromNow(30),
    path: REFRESH_PATH,
})

type Params = {
    response: Global.Response
    accessToken: string
    refreshToken: string
}
export function setAuthCookies({
    accessToken,
    refreshToken,
    response,
}: Params) {
    return response
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions())
}

export function clearAuthCookies(response: Global.Response) {
    return response.clearCookie("accessToken").clearCookie("refreshToken", {
        path: REFRESH_PATH,
    })
}
