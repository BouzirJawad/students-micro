const mongoose = require('mongoose')

const submissionSchema = new mongoose.Schema({
  examId: { type: String, required: true },
  links: [{ type: String }],
  status: {
    type: String,
    enum: ["pending", "validated", "rejected"],
    default: "pending"
  }
});

const studentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    }, 
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    assignedExams: [{ type: String }],
    submissions: [submissionSchema]
})

const studentModel = mongoose.model('Student', studentSchema);

module.exports = studentModel;