import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import { CLIENT_URL } from "@constants/config"
import { connectDatabase } from "@apis/database"

import { errorHandler } from "@middleware/error-handler"
import { authenticate } from "@middleware/authenticate"

import authRoute from "@routes/auth-route"
import userRoute from "@routes/user-route"
import healthRoute from "@routes/health-route"
import sessionRoute from "@routes/session-route"

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: CLIENT_URL,
        credentials: true,
    })
)

app.use("/health", healthRoute)
app.use("/auth", authRoute)
app.use("/user", authenticate, userRoute)
app.use("/sessions", authenticate, sessionRoute)
app.use(errorHandler)

const IP = process.env.IP || "localhost"
const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log(`> Development Server is listening on http://${IP}:${PORT}`)
    await connectDatabase()
})
