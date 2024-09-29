import { z } from "zod"

export const emailSchema = z
    .string({
        message: "Email address is required.",
    })
    .min(1, "Email address is required.")
    .max(255, "Email address must not exceed 255 characters.")
    .email("Email format is invalid.")

export const passwordSchema = z
    .string({
        message: "Password is required.",
    })
    .min(6, "Password must be at least 6 characters long.")
    .max(255, "Password must not exceed 255 characters.")

export const signinSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
})

export const registerSchema = signinSchema
    .extend({
        confirm_password: z
            .string({
                message: "Password confirmation is required.",
            })
            .min(6, "Password confirmation must be at least 6 characters long.")
            .max(255, "Password confirmation must not exceed 255 characters."),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })

export const VerificationCodeSchema = z
    .string({
        message: "Verification Code is required.",
    })
    .min(1, "Verification code is required.")
    .max(24, "Verification code must not exceed 24 characters.")

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    verification_code: VerificationCodeSchema,
})
