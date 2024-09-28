import jwt, { Secret, SignOptions } from "jsonwebtoken"
import { Document } from "mongoose"

import { JWT_REFRESH_SECRET, JWT_SECRET } from "@constants/config"

export type RefreshTokenPayload = {
    sessionid: Document["_id"]
}

export type AccessTokenPayload = {
    sessionid: Document["_id"]
    userid: Document["_id"]
}

type SignOptionsAndSecret = SignOptions & {
    secret: Secret
}

const defaultOptions: SignOptions = {
    audience: ["user"],
}

const accessTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "15m",
    secret: JWT_SECRET,
}

export const refreshTokenSignOptions: SignOptionsAndSecret = {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET,
}

export const tokenSign = (
    payload: RefreshTokenPayload | AccessTokenPayload,
    options?: SignOptionsAndSecret
) => {
    const { secret, ...signOptions } = options || accessTokenSignOptions
    return jwt.sign(payload, secret, { ...defaultOptions, ...signOptions })
}

export const verifyToken = <TPayload extends object = AccessTokenPayload>(
    token: string,
    options?: SignOptionsAndSecret
) => {
    const { secret = JWT_SECRET, ...verifyOptions } = options || {}
    try {
        const payload = jwt.verify(token, secret, {
            ...defaultOptions,
            ...verifyOptions,
        }) as TPayload
        return { payload }
    } catch (error) {
        return {
            error: error,
        }
    }
}
