import catchErrors from "@utils/catch-async-error"
import { appAssert } from "@utils/app-assert"
import {
    clearAuthCookies,
    getAccessTokenCookieOptions,
    getRefreshTokenCookieOptions,
    setAuthCookies,
} from "@utils/cookies"
import { verifyToken } from "@utils/token-sign"

import {
    emailSchema,
    registerSchema,
    resetPasswordSchema,
    signinSchema,
    VerificationCodeSchema,
} from "@/validation/auth-validation"
import { CREATED, OK, UNAUTHORIZED } from "@constants/http"
import {
    createAccount,
    refreshAccessToken,
    resetPassword,
    sendPasswordResetEmail,
    loginUser,
    verifyEmail,
} from "@services/auth-services"
import { SessionModel } from "@models/session-model"

export const registerController = catchErrors(async function (
    request,
    response
) {
    const body = registerSchema.parse({
        ...request.body,
        userAgent: request.headers["user-agent"],
    })

    const { user, accessToken, refreshToken } = await createAccount(body)

    return setAuthCookies({ response, accessToken, refreshToken })
        .status(CREATED)
        .json({ user })
})
export const loginController = catchErrors(async function (request, response) {
    const body = signinSchema.parse({
        ...request.body,
        userAgent: request.headers["user-agent"],
    })

    const { user, accessToken, refreshToken } = await loginUser(body)

    return setAuthCookies({ response, accessToken, refreshToken })
        .status(OK)
        .json({
            message: "User logged in successfully",
        })
})
export const logoutController = catchErrors(async function (request, response) {
    const accessToken = request.cookies.accessToken as string | undefined
    const { payload } = verifyToken(accessToken || "")

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionid)
    }

    return clearAuthCookies(response).status(OK).json({
        message: "User logged out successfully",
    })
})
export const refreshTokenController = catchErrors(async function (
    request,
    response
) {
    const refreshToken = request.cookies.refreshToken as string | undefined
    appAssert(
        refreshToken,
        UNAUTHORIZED,
        "Refresh token is missing. Please provide a valid token to continue."
    )
    const { accessToken, newRefreshToken } = await refreshAccessToken(
        refreshToken
    )

    if (newRefreshToken)
        response.cookie(
            "refreshToken",
            newRefreshToken,
            getRefreshTokenCookieOptions()
        )
    return response
        .status(OK)
        .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
        .json({
            message: "Access token has been refreshed successfully.",
        })
})
export const emailVerificationController = catchErrors(async function (
    request,
    response
) {
    const verification_code = VerificationCodeSchema.parse(request.params.code)
    await verifyEmail(verification_code)
    return response.status(OK).json({
        message: "Email verified successfully. Your account is now verified.",
    })
})
export const passwordForgotController = catchErrors(async function (
    request,
    response
) {
    const email = emailSchema.parse(request.body.email)

    await sendPasswordResetEmail(email)
    return response.status(OK).json({
        message:
            "Password reset email sent successfully. Please check your inbox.",
    })
})
export const passwordResetController = catchErrors(async function (
    request,
    response
) {
    const body = resetPasswordSchema.parse(request.body)

    await resetPassword(body)
    return clearAuthCookies(response).status(OK).json({
        message:
            "Password has been reset successfully. You can now log in with your new password.",
    })
})
