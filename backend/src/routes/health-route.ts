import express from "express"
const router = express.Router()

// Handle User Requests here
router.get("/", (request, response) => {
    response.status(200).json({
        message: "Server is Healty!",
        subject: "Health Okay",
    })
})

export default router
