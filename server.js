const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// In-memory database (in production, use a real database)
const studentsDatabase = [
  {
    rollNumber: "2024001",
    name: "John Doe",
    class: "10th Grade",
    marks: [
      { subject: "Mathematics", marks: 85 },
      { subject: "Science", marks: 92 },
      { subject: "English", marks: 78 },
    ],
    attendance: [
      { date: "2024-01-15", status: "Present" },
      { date: "2024-01-16", status: "Present" },
      { date: "2024-01-17", status: "Absent" },
      { date: "2024-01-18", status: "Present" },
      { date: "2024-01-19", status: "Present" },
    ],
  },
  {
    rollNumber: "2024002",
    name: "Jane Smith",
    class: "10th Grade",
    marks: [
      { subject: "Mathematics", marks: 95 },
      { subject: "Science", marks: 88 },
      { subject: "English", marks: 91 },
    ],
    attendance: [
      { date: "2024-01-15", status: "Present" },
      { date: "2024-01-16", status: "Present" },
      { date: "2024-01-17", status: "Present" },
      { date: "2024-01-18", status: "Present" },
      { date: "2024-01-19", status: "Absent" },
    ],
  },
  {
    rollNumber: "2024003",
    name: "Mike Johnson",
    class: "9th Grade",
    marks: [
      { subject: "Mathematics", marks: 72 },
      { subject: "Science", marks: 79 },
      { subject: "English", marks: 85 },
    ],
    attendance: [
      { date: "2024-01-15", status: "Present" },
      { date: "2024-01-16", status: "Absent" },
      { date: "2024-01-17", status: "Present" },
      { date: "2024-01-18", status: "Present" },
      { date: "2024-01-19", status: "Present" },
    ],
  },
]

// API Routes

// Get all students
app.get("/api/students", (req, res) => {
  res.json({
    success: true,
    students: studentsDatabase,
  })
})

// Get student by roll number
app.get("/api/student/:rollNumber", (req, res) => {
  const rollNumber = req.params.rollNumber
  const student = studentsDatabase.find((s) => s.rollNumber === rollNumber)

  if (student) {
    res.json({
      success: true,
      student: student,
    })
  } else {
    res.json({
      success: false,
      message: "Student not found",
    })
  }
})

// Add or update student
app.post("/api/student", (req, res) => {
  const { rollNumber, name, class: studentClass, marks, attendance } = req.body

  // Find existing student or create new one
  const studentIndex = studentsDatabase.findIndex((s) => s.rollNumber === rollNumber)

  if (studentIndex === -1) {
    // Create new student
    const newStudent = {
      rollNumber,
      name,
      class: studentClass,
      marks: [],
      attendance: [],
    }

    if (marks) {
      newStudent.marks.push(marks)
    }

    if (attendance) {
      newStudent.attendance.push(attendance)
    }

    studentsDatabase.push(newStudent)
  } else {
    // Update existing student
    const student = studentsDatabase[studentIndex]

    // Update basic info
    student.name = name
    student.class = studentClass

    // Add or update marks
    if (marks) {
      const existingMarkIndex = student.marks.findIndex((m) => m.subject === marks.subject)
      if (existingMarkIndex !== -1) {
        student.marks[existingMarkIndex] = marks
      } else {
        student.marks.push(marks)
      }
    }

    // Add attendance record
    if (attendance) {
      student.attendance.push(attendance)
    }
  }

  res.json({
    success: true,
    message: "Student data updated successfully",
  })
})

// Delete student (optional)
app.delete("/api/student/:rollNumber", (req, res) => {
  const rollNumber = req.params.rollNumber
  const studentIndex = studentsDatabase.findIndex((s) => s.rollNumber === rollNumber)

  if (studentIndex !== -1) {
    studentsDatabase.splice(studentIndex, 1)
    res.json({
      success: true,
      message: "Student deleted successfully",
    })
  } else {
    res.json({
      success: false,
      message: "Student not found",
    })
  }
})

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`🎓 EduConnect Server running on http://localhost:${PORT}`)
  console.log("📚 Sample student data loaded:")
  console.log("   - Roll Number: 2024001 (John Doe)")
  console.log("   - Roll Number: 2024002 (Jane Smith)")
  console.log("   - Roll Number: 2024003 (Mike Johnson)")
})
