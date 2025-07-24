const express = require('express')
const connectDB = require("./config/db")
const studentRoutes = require("./routes/student.routes")
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 7463

app.use(express.json())

connectDB()

app.use("/api/students", studentRoutes)

app.listen(PORT, () => {
    console.log(`Student server is Running on port ${PORT}`)
})

