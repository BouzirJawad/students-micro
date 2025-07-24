const Student = require("../models/Student");
const axios = require("axios");

const createStudent = async (req, res) => {
  try {
    const { userId } = req.params;

    const existing = await Student.findOne({ userId });
    if (existing) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const student = new Student({ userId });
    await student.save();
    res.status(201).json({ message: "Student created", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const assignBriefToStudent = async (req, res) => {
  const { studentId, briefId } = req.params;

  try {
    const briefRes = await axios.get(`${process.env.BRIEF_URL}/${briefId}`);
    const brief = briefRes.data;

    if (!brief) {
      return res.status(404).json({ message: "Brief not found" });
    }

    const fetchedSkills = [];
    for (const code of brief.skillCodes) {
      const skillRes = await axios.get(
        `${process.env.SKILLS_URL}/code/${code}`
      );
      const skill = skillRes.data;

      if (skill) {
        fetchedSkills.push({
          code: skill.code,
          title: skill.title,
          isValid: undefined,
          subSkills: skill.subSkills.map((sub) => ({
            title: sub.title,
            priority: sub.priority,
            isValid: undefined,
          })),
        });
      }
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const alreadyAssigned = student.assignedBriefs.some(
      (b) => b.briefId === briefId
    );

    if (alreadyAssigned) {
      return res
        .status(400)
        .json({ message: "Brief already assigned to this student" });
    }

    student.assignedBriefs.push({
      briefId,
      skills: fetchedSkills,
      submissions: [],
    });

    await student.save();
    res.status(201).json({ message: "Brief assigned successfully", student });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to assign brief" });
  }
};

const submitBrief = async (req, res) => {
  const { studentId, briefId } = req.params;
  const { links, description } = req.body;

  try {
    if (!Array.isArray(links) || links.length === 0) {
      return res.status(400).json({ message: "At least one link is required" });
    }
    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required" });
    }
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assignedBrief = student.assignedBriefs.find(
      (b) => b.briefId === briefId
    );
    if (!assignedBrief) {
      return res
        .status(404)
        .json({ message: "Brief not assigned to this student" });
    }

    const newSubmission = { links, description };
    assignedBrief.submissions.push(newSubmission);
    await student.save();

    return res.status(201).json({
      message: "Submission added successfully",
      submissions: assignedBrief.submissions,
    });
  } catch (error) {
    console.error("Submit Brief Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();

    if (!students || students.length === 0) {
      return res.status(404).josn({ message: "No Students available" });
    }

    res.status(201).json(students);
  } catch (error) {
    console.error("Server Error", error.message)
    res.json(500).json({ message: "Server error", error: error.message })
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)

    if (!student) {
      return res.status(404).json({ message: "Student not found"})
    }

    res.status(201).json(student)
  } catch (error) {
    console.error("Server Error", error.message)
    res.json(500).json({ message: "Server error", error: error.message })
  }
};

// const assignBriefToManyStudents = async (req, res) => {
//   const { briefId } = req.params;       // brief to assign
//   const { studentIds } = req.body;      // array of students

//   try {
//     // ✅ Fetch the brief
//     const briefRes = await axios.get(`${process.env.BRIEF_URL}/${briefId}`);
//     const brief = briefRes.data;
//     if (!brief) {
//       return res.status(404).json({ message: "Brief not found" });
//     }

//     // ✅ Fetch required skills for the brief
//     const fetchedSkills = [];
//     for (const code of brief.skillCodes) {
//       const skillRes = await axios.get(`${process.env.SKILLS_URL}/code/${code}`);
//       const skill = skillRes.data;
//       if (skill) {
//         fetchedSkills.push({
//           code: skill.code,
//           title: skill.title,
//           isValid: undefined,
//           subSkills: skill.subSkills.map(sub => ({
//             title: sub.title,
//             priority: sub.priority,
//             isValid: undefined
//           }))
//         });
//       }
//     }

//     const results = [];

//     for (const studentId of studentIds) {
//       const student = await Student.findById(studentId);

//       if (!student) {
//         results.push({ studentId, status: "Student not found" });
//         continue;
//       }

//       // ✅ Prevent duplicate assignment
//       const alreadyAssigned = student.assignedBriefs.some(
//         (b) => b.briefId === briefId
//       );

//       if (alreadyAssigned) {
//         results.push({ studentId, status: "Already assigned" });
//         continue;
//       }

//       // ✅ Assign brief
//       student.assignedBriefs.push({
//         briefId,
//         skills: fetchedSkills,
//         submissions: []
//       });

//       await student.save();
//       results.push({ studentId, status: "Assigned successfully" });
//     }

//     res.status(200).json({
//       message: "Bulk assignment complete",
//       results
//     });

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Failed to assign brief to multiple students" });
//   }
// };


module.exports = {
  createStudent,
  assignBriefToStudent,
  submitBrief,
  getStudents,
  getStudent,
};
