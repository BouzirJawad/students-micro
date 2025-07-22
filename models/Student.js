const mongoose = require("mongoose");

const subSkillSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  isValid: {
    type: Boolean,
    default: undefined,
  },
});

const skillSchema = new mongoose.Schema({
  code: { type: String, required: true },
  title: { type: String, required: true },
  isValid: {
    type: Boolean,
    default: undefined,
  },
  subSkills: [subSkillSchema],
});

const submissionSchema = new mongoose.Schema({
  links: {
    type: [String],
    validate: {
      validator: function (arr) {
        return Array.isArray(arr) && arr.length > 0;
      },
      message: "At least one link is required"
    }
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
});

const assignedBriefSchema = new mongoose.Schema({
  briefId: {
    type: String,
    required: true,
  },
  skills: [skillSchema],
  submissions: [submissionSchema],
});

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  assignedBriefs: [assignedBriefSchema],
});

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;
