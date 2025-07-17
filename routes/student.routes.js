const express = require('express')
const router = express.Router()
const studentController = require('../controllers/student.controller')

router.post("/create", studentController.createStudent)
router.get("/", studentController.getStudents)
router.post("/:studentId/assign-brief", studentController.assignExam)
router.post("/:studentId/submit", studentController.submitExam)

router.get("/test", async (req, res) => {
    res.send("Students server is working")
})

module.exports = router