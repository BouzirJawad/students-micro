const Student = require("../models/Student")

// ✅ Create student
const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) return res.status(409).json({ message: "Student already exists" });

    const student = new Student({ firstName, lastName, email });
    await student.save();
    res.status(201).json({ message: "Student created", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Assign exam
const assignExam = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { examId } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.assignedExams.includes(examId)) {
      student.assignedExams.push(examId);
      await student.save();
    }

    res.json({ message: "Exam assigned", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Submit exam
const submitExam = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { examId, links } = req.body;

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.submissions.push({ examId, links });
    await student.save();

    res.json({ message: "Submission saved", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all students
const getStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};


module.exports = { createStudent, assignExam, submitExam, getStudents}