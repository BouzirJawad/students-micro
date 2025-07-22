const computeSkillValidity = require("../helpers/computeSkillValidity");
const Student = require("../models/Student");

const validateStudentSubSkill = async (req, res) => {
  const { studentId, briefId, skillCode, subSkillTitle } = req.params;
  const { isValid } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const assignedBrief = student.assignedBriefs.find(ab => ab.briefId === briefId);
    if (!assignedBrief) return res.status(404).json({ message: "Exam not found for this student" });

    const skill = assignedBrief.skills.find(s => s.code === skillCode);
    if (!skill) return res.status(404).json({ message: "Skill not found for this student" });

    const subSkill = skill.subSkills.find(sub => sub.title === subSkillTitle);
    if (!subSkill) return res.status(404).json({ message: "SubSkill not found" });

    subSkill.isValid = isValid;

    skill.isValid = computeSkillValidity(skill.subSkills);

    await student.save();
    res.json({
      message: "Student subSkill validation updated",
      udpatedSkill: skill
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to validate subskill" });
  }
};


module.exports = { validateStudentSubSkill }