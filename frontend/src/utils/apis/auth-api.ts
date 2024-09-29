import { request } from "@/utils/api-client"

type LoginAPIParams = {
    email: string
    password: string
}
export async function loginAPI(data: LoginAPIParams) {
    // login
    return request.post("/auth/login", data)
}

type RegisterAPIParams = {
    confirm_password: string
} & LoginAPIParams
export async function registerAPI( // create
    data: RegisterAPIParams & {
        confirm_password: string
    }
) {
    return request.post("/auth/register", data)
}

export async function emailVerifyAPI(code: string) {
    // verifyEmail
    return request.get(`/auth/email/verify/${code}`)
}

export async function passwordResetRequestAPI(email: string) {
    // sendPasswordResetEmail
    return request.post(`/auth/password/forgot`, { email })
}

type ResetPasswordAPIParams = {
    password: string
    verification_code: string
}
export async function resetPasswordAPI(data: ResetPasswordAPIParams) {
    // resetPassword
    return request.post(`/auth/password/reset`, data)
}
