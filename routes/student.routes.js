const express = require('express')
const router = express.Router()
const studentController = require('../controllers/student.controller')
const studentValidation = require('../controllers/studentValidation.controller')

router.post("/student/:userId/create", studentController.createStudent)
router.get("/", studentController.getStudents)
router.get("/student/:id", studentController.getStudent)

router.post("/student/:studentId/brief/:briefId/submit", studentController.submitBrief)
router.post("/student/:studentId/brief/:briefId/assign-brief", studentController.assignBriefToStudent)
router.put("/student/:studentId/brief/:briefId/skill/:skillCode/subskill/:subSkillTitle/validate", studentValidation.validateStudentSubSkill)

router.get("/test", async (req, res) => {
    res.send("Students server is working")
})

module.exports = router