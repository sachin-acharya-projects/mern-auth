import { z } from "zod"

export const emailSchema = z
    .string({
        message: "`email` field is required.",
    })
    .min(1, "`email` field cannot be empty")
    .max(255, "`email` cannot be more than 255 characters.")
    .email("`email` format is invalid.")
export const passwordSchema = z
    .string({
        message: "`password` field is required.",
    })
    .min(6, "`password` should be minimum 6 characters long.")
    .max(255, "`password` cannot be more than 255 characters.")

export const signinSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    userAgent: z.string().optional(),
})

export const registerSchema = signinSchema
    .extend({
        confirm_password: z
            .string({
                message: "`confirm_password` field is required.",
            })
            .min(6)
            .max(255),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })

export const VerificationCodeSchema = z
    .string({
        message: "Verification Code is missing.",
    })
    .min(1, "Verification code cannot be empty.")
    .max(24, "Verification code cannot exceed length of 24 characters.")

export const resetPasswordSchema = z.object({
    password: passwordSchema,
    verification_code: VerificationCodeSchema,
})
