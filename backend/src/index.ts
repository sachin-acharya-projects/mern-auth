import express from "express"

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Routing
app.get("/", (request, response) => {
    response.status(200).send("<h1>Server is working fine!</h1>")
})

const IP = process.env.IP || "localhost"
const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
    console.log(`> Development Server is listening on http://${IP}:${PORT}`)
})
