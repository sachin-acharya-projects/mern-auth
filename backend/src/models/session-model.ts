import { xDaysFromNow } from "@utils/date"
import mongoose, { Document, model, Schema } from "mongoose"

interface SessionDocument extends Document {
    userid: mongoose.Types.ObjectId
    userAgent?: string
    createdAt: Date
    expiresAt: Date
}

const SessionSchema = new Schema<SessionDocument>({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    userAgent: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
    expiresAt: {
        type: Date,
        default: xDaysFromNow(30),
    },
})

export const SessionModel = model<SessionDocument>("Session", SessionSchema)
