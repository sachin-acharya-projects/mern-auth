import { MONGODB_URI } from "@constants/config"
import mongoose from "mongoose"


export async function connectDatabase() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("> Connected to the Database")
    } catch (error) {
        console.error("> Cannot connect to the database.")
        if (error instanceof Error) console.error(error.message)
        else console.error(error)
        process.exit(1) // Exit with Fail Status
    }
}
