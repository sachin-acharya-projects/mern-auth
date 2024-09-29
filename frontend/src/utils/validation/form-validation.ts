import { z } from "zod"

// Email Schema
export const emailSchema = z
    .string({
        message: "Please enter your email address.",
    })
    .min(1, "Email address is required.")
    .max(255, "Email address must not exceed 255 characters.")
    .email("Please provide a valid email address.")

// Password Schema
export const passwordSchema = z
    .string({
        message: "Please enter your password.",
    })
    .min(6, "Password should be at least 6 characters long.")
    .max(255, "Password must not exceed 255 characters.")

// Sign-in Schema
export const signinSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
})

// Registration Schema
export const registerSchema = signinSchema
    .extend({
        confirm_password: z
            .string({
                message: "Please confirm your password.",
            })
            .min(
                6,
                "Confirmation password should be at least 6 characters long."
            )
            .max(255, "Confirmation password must not exceed 255 characters."),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match. Please try again.",
        path: ["confirm_password"],
    })

// Verification Code Schema
export const VerificationCodeSchema = z
    .string({
        message: "Please enter the verification code.",
    })
    .min(1, "Verification code is required.")
    .max(24, "Verification code must not exceed 24 characters.")

// Reset Password Schema
export const resetPasswordSchema = z.object({
    password: passwordSchema,
})
