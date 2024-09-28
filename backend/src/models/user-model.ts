import { Model, model, Schema } from "mongoose"
import bcrypt from "bcrypt"

interface IUser {
    email: string
    password: string
    verified: boolean
    createdAt: Date
    expiresAt: Date
}

interface IUserMethods {
    comparePassword(password: string): Promise<boolean>
    toSafeJSON(): Omit<IUser, "password">
}
interface UserModel extends Model<IUser, {}, IUserMethods> {
    emailExists(email: string): Promise<boolean>
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
        methods: {
            async comparePassword(password): Promise<boolean> {
                if (!password)
                    throw new Error("'password' paramter is missing.")
                try {
                    return await bcrypt.compare(password, this.password)
                } catch (error) {
                    console.error(error)
                    return false
                }
            },
            toSafeJSON() {
                const { password, ...data } = this.toJSON()
                return data
            },
        },
        statics: {
            async emailExists(email: string): Promise<boolean> {
                if (!email) throw new Error("'email' parameter is missing.")
                try {
                    const user = await this.findOne({ email })
                    return user ? true : false
                } catch (error) {
                    if (error instanceof Error) console.error(error.message)
                    else console.error("Techinical Issue Encountered", error)
                    return false
                }
            },
        },
    }
)

userSchema.pre("save", function (next): void {
    if (this.isModified("password")) {
        bcrypt.hash(this.password, 8, (err, hash) => {
            if (err) return next(err)
            this.password = hash
            next()
        })
    }
})

export const UserModel = model<IUser, UserModel>("User", userSchema)
