import { VerificationCodeType } from "@constants/enums"
import mongoose, { Document, model, Schema } from "mongoose"

interface VerificationCodeDocument extends Document {
    userid: mongoose.Types.ObjectId
    type: VerificationCodeType
    createdAt: Date
    expiresAt: Date
}

const verificationSchema = new Schema<VerificationCodeDocument>({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    type: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    expiresAt: {
        type: Date,
        required: true,
        // default: Date.now()
    },
})

export const VerificationCodeModel = model<VerificationCodeDocument>(
    "VerificationCode",
    verificationSchema,
    "verification_codes"
)
