import { SessionModel, UserModel, VerificationCodeModel } from "@models/models"

import { Enums, Http, Settings } from "@constants/index"
import { appAssert, AppError, DateUtils, TokenSign } from "@utils/index"
import { EmailTemplates, sendMail } from "@mail/index"

export type CreateAccountParams = {
    email: string
    password: string
    userAgent?: string
}
export async function createAccount({
    email,
    password,
    userAgent,
}: CreateAccountParams) {
    const emailExist = await UserModel.exists({ email })
    appAssert(
        !emailExist,
        Http.CONFLICT,
        "User already exists. Please log in instead."
    )

    const user = await UserModel.create({ email, password })
    const userid = user._id

    const verification_code = await VerificationCodeModel.create({
        userid,
        type: Enums.VerificationCodeType.EMAIL_VERIFICATION,
        expiresAt: DateUtils.xYearsFromNow(1),
    })
    const url = `${Settings.CLIENT_URL}/email/verify/${verification_code._id}`
    const { error } = await sendMail({
        to: user.email,
        ...EmailTemplates.getVerifyEmailTemplate(url),
    })
    if (error) {
        console.error(error)
    }

    const session = await SessionModel.create({
        userid,
        userAgent,
    })
    const sessionid = session._id

    const refreshToken = TokenSign.tokenSign(
        {
            sessionid,
        },
        TokenSign.refreshTokenSignOptions
    )
    const accessToken = TokenSign.tokenSign({
        sessionid,
        userid,
    })

    return {
        user: user.toSafeJSON(),
        accessToken,
        refreshToken,
    }
}

type LoginParams = CreateAccountParams
export async function loginUser({ email, password, userAgent }: LoginParams) {
    const user = await UserModel.findOne({ email })
    appAssert(
        user,
        Http.UNAUTHORIZED,
        "Email or password is incorrect. Please try again."
    )

    const isValid = await user.comparePassword(password)

    appAssert(
        isValid,
        Http.UNAUTHORIZED,
        "Email or password is incorrect. Please try again."
    )

    const userid = user._id

    // Send Verification Email
    const session = await SessionModel.create({
        userid,
        userAgent,
    })

    const sessionid = session._id
    const refreshToken = TokenSign.tokenSign(
        {
            sessionid,
        },
        TokenSign.refreshTokenSignOptions
    )
    const accessToken = TokenSign.tokenSign({
        sessionid,
        userid,
    })
    return {
        user: user.toSafeJSON(),
        accessToken,
        refreshToken,
    }
}

export const refreshAccessToken = async (refreshToken: string) => {
    const { payload } = TokenSign.verifyToken<TokenSign.RefreshTokenPayload>(
        refreshToken,
        {
            secret: TokenSign.refreshTokenSignOptions.secret,
        }
    )
    appAssert(
        payload,
        Http.UNAUTHORIZED,
        "Invalid refresh token. Please log in again."
    )
    const session = await SessionModel.findById(payload.sessionid)

    const now = Date.now()
    appAssert(
        session && session.expiresAt.getTime() > now,
        Http.UNAUTHORIZED,
        "Session expired. Please log in again to continue."
    )

    // Refresh the session if it expires within 24 hours
    const sessionNeedsRefresh =
        session.expiresAt.getTime() - now <= DateUtils.ONE_DAY_MILLS
    if (sessionNeedsRefresh) {
        session.expiresAt = DateUtils.xDaysFromNow(30)
        await session.save()
    }

    const newRefreshToken = sessionNeedsRefresh
        ? TokenSign.tokenSign(
              {
                  sessionid: session._id,
              },
              TokenSign.refreshTokenSignOptions
          )
        : undefined

    const accessToken = TokenSign.tokenSign({
        userid: session.userid,
        sessionid: session._id,
    })

    return {
        accessToken,
        newRefreshToken,
    }
}

export const verifyEmail = async (code: string) => {
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: Enums.VerificationCodeType.EMAIL_VERIFICATION,
        expiresAt: { $gt: new Date() },
    })
    appAssert(
        validCode,
        Http.NOT_FOUND,
        "Invalid verification code. Please check the code and try again."
    )

    const user = await UserModel.findByIdAndUpdate(
        validCode.userid,
        {
            verified: true,
        },
        {
            new: true,
        }
    )
    if (!user) await validCode.deleteOne()
    appAssert(
        user,
        Http.INTERNAL_SERVER_ERROR,
        "Failed to verify email. Please try again later."
    )
    await validCode.deleteOne()
    return {
        user: user.toSafeJSON(),
    }
}

export const sendPasswordResetEmail = async (email: string) => {
    try {
        const user = await UserModel.findOne({ email })
        appAssert(
            user,
            Http.NOT_FOUND,
            "Email not found. Please check the email address and try again."
        )

        const fiveMinAgo = DateUtils.xMinutesAgo(5)
        const counts = await VerificationCodeModel.countDocuments({
            userid: user._id,
            type: Enums.VerificationCodeType.PASSWORD_RESET,
            createdAt: {
                $gt: fiveMinAgo,
            },
        })

        let message = Http.getMessage(Http.TOO_MANY_REQUESTS)
        appAssert(counts <= 1, Http.TOO_MANY_REQUESTS, message.message)

        const expiresAt = DateUtils.xHoursFromNow(1)
        const verification_code = await VerificationCodeModel.create({
            userid: user._id,
            type: Enums.VerificationCodeType.PASSWORD_RESET,
            expiresAt,
        })

        const url = `${Settings.CLIENT_URL}/password/reset?code=${
            verification_code._id
        }&exp=${expiresAt.getTime()}`

        const { data, error } = await sendMail({
            to: user.email,
            ...EmailTemplates.getPasswordResetTemplate(url),
        })

        message = Http.getMessage(Http.INTERNAL_SERVER_ERROR)
        appAssert(data?.id, Http.INTERNAL_SERVER_ERROR, message.message)
        if (error) console.error(error)
        return {
            url,
            emailid: data.id,
        }
    } catch (error) {
        console.error("Password Reset Error Occured", (error as any).message)
        return {}
    }
}

type ResetPasswordParams = {
    password: string
    verification_code: string
}
export const resetPassword = async ({
    password,
    verification_code,
}: ResetPasswordParams) => {
    const validCode = await VerificationCodeModel.findOne({
        _id: verification_code,
        type: Enums.VerificationCodeType.PASSWORD_RESET,
        expiresAt: {
            $gt: new Date(),
        },
    })
    appAssert(
        validCode,
        Http.NOT_FOUND,
        "Invalid verification code. Please check the code and try again."
    )
    const updatedUser = await UserModel.findById(validCode.userid)
    appAssert(
        updatedUser,
        Http.NOT_FOUND,
        "Email not found. Please check the email address and try again."
    )
    updatedUser.password = password
    const savedUser = await updatedUser.save()
    appAssert(
        savedUser,
        Http.INTERNAL_SERVER_ERROR,
        "Failed to update password. Please try again later."
    )

    await validCode.deleteOne()
    await SessionModel.deleteMany({
        userid: updatedUser._id,
    })
    return {
        user: updatedUser.toSafeJSON(),
    }
}
