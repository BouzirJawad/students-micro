const mongoose = require('mongoose')

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        .then(()=> console.log("MongoDB is Connected successfully!"))
    } catch (error) {
        console.log("Error connecting to mongoDb", error)
    }
}

module.exports = connectDB