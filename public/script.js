// Global variables
let currentRole = ""
const studentsData = []

// API base URL
const API_BASE = "https://1ba38310-01de-4603-9f40-863223f73021-00-2g0jet3252ffi.pike.replit.dev/"

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Check if we're on a specific dashboard page
  const urlParams = new URLSearchParams(window.location.search)
  const role = urlParams.get("role")

  if (role) {
    currentRole = role
    showDashboard(role)
  }
})

// Role selection function
function selectRole(role) {
  currentRole = role
  window.location.href = `?role=${role}`
}

// Show appropriate dashboard based on role
function showDashboard(role) {
  const mainContent = document.querySelector(".main-content")

  switch (role) {
    case "parent":
      showParentDashboard(mainContent)
      break
    case "teacher":
      showTeacherDashboard(mainContent)
      break
    case "student":
      showStudentDashboard(mainContent)
      break
  }
}

// Parent Dashboard
function showParentDashboard(container) {
  container.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2 class="dashboard-title">👨‍👩‍👧‍👦 Parent Dashboard</h2>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
            
            <div class="input-section">
                <div class="input-group">
                    <div class="form-group">
                        <label for="childRollNumber">Enter Your Child's Roll Number:</label>
                        <input type="text" id="childRollNumber" placeholder="e.g., 2024001">
                    </div>
                    <button class="btn" onclick="searchChildData()">Search</button>
                </div>
            </div>
            
            <div id="childDataContainer" class="hidden">
                <h3>Child's Academic Progress</h3>
                <div id="childInfo"></div>
                <div id="childMarks"></div>
                <div id="childAttendance"></div>
            </div>
        </div>
    `
}

// Teacher Dashboard
function showTeacherDashboard(container) {
  container.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2 class="dashboard-title">👩‍🏫 Teacher Dashboard</h2>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
            
            <div class="input-section">
                <h3>Add/Update Student Information</h3>
                <div class="input-group">
                    <div class="form-group">
                        <label for="studentRoll">Roll Number:</label>
                        <input type="text" id="studentRoll" placeholder="e.g., 2024001">
                    </div>
                    <div class="form-group">
                        <label for="studentName">Student Name:</label>
                        <input type="text" id="studentName" placeholder="Enter student name">
                    </div>
                    <div class="form-group">
                        <label for="studentClass">Class:</label>
                        <input type="text" id="studentClass" placeholder="e.g., 10th Grade">
                    </div>
                </div>
                
                <div class="input-group" style="margin-top: 1rem;">
                    <div class="form-group">
                        <label for="subject">Subject:</label>
                        <select id="subject">
                            <option value="">Select Subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Science">Science</option>
                            <option value="English">English</option>
                            <option value="History">History</option>
                            <option value="Geography">Geography</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="marks">Marks:</label>
                        <input type="number" id="marks" placeholder="Enter marks" min="0" max="100">
                    </div>
                    <div class="form-group">
                        <label for="attendance">Attendance:</label>
                        <select id="attendance">
                            <option value="">Select Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-top: 1rem;">
                    <button class="btn btn-success" onclick="addOrUpdateStudent()">Add/Update Student</button>
                    <button class="btn" onclick="loadAllStudents()">Load All Students</button>
                </div>
            </div>
            
            <div id="alertContainer"></div>
            
            <div id="studentsContainer">
                <h3>All Students</h3>
                <div id="studentsTable"></div>
            </div>
        </div>
    `

  // Load all students on dashboard load
  loadAllStudents()
}

// Student Dashboard
function showStudentDashboard(container) {
  container.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h2 class="dashboard-title">🎒 Student Dashboard</h2>
                <button class="logout-btn" onclick="logout()">Logout</button>
            </div>
            
            <div class="input-section">
                <div class="input-group">
                    <div class="form-group">
                        <label for="studentRollNumber">Enter Your Roll Number:</label>
                        <input type="text" id="studentRollNumber" placeholder="e.g., 2024001">
                    </div>
                    <button class="btn" onclick="searchStudentData()">View My Progress</button>
                </div>
            </div>
            
            <div id="studentDataContainer" class="hidden">
                <h3>My Academic Progress</h3>
                <div id="studentInfo"></div>
                <div id="studentMarks"></div>
                <div id="studentAttendance"></div>
            </div>
        </div>
    `
}

// Search child data for parents
async function searchChildData() {
  const rollNumber = document.getElementById("childRollNumber").value.trim()

  if (!rollNumber) {
    alert("Please enter a roll number")
    return
  }

  try {
    const response = await fetch(`${API_BASE}/student/${rollNumber}`)
    const data = await response.json()

    if (data.success) {
      displayChildData(data.student)
    } else {
      alert("Student not found")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error fetching student data")
  }
}

// Search student data for students
async function searchStudentData() {
  const rollNumber = document.getElementById("studentRollNumber").value.trim()

  if (!rollNumber) {
    alert("Please enter your roll number")
    return
  }

  try {
    const response = await fetch(`${API_BASE}/student/${rollNumber}`)
    const data = await response.json()

    if (data.success) {
      displayStudentData(data.student)
    } else {
      alert("Student not found")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error fetching student data")
  }
}

// Display child data for parents
function displayChildData(student) {
  const container = document.getElementById("childDataContainer")
  const infoDiv = document.getElementById("childInfo")
  const marksDiv = document.getElementById("childMarks")
  const attendanceDiv = document.getElementById("childAttendance")

  // Student Info
  infoDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <h4>Student Information</h4>
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
            <p><strong>Class:</strong> ${student.class}</p>
        </div>
    `

  // Marks
  if (student.marks && student.marks.length > 0) {
    let marksTable = `
            <h4>Academic Performance</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
        `

    student.marks.forEach((mark) => {
      const grade = getGrade(mark.marks)
      marksTable += `
                <tr>
                    <td>${mark.subject}</td>
                    <td>${mark.marks}/100</td>
                    <td>${grade}</td>
                </tr>
            `
    })

    marksTable += "</tbody></table>"
    marksDiv.innerHTML = marksTable
  } else {
    marksDiv.innerHTML = "<p>No marks recorded yet.</p>"
  }

  // Attendance
  if (student.attendance && student.attendance.length > 0) {
    let attendanceTable = `
            <h4>Attendance Record</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `

    student.attendance.forEach((record) => {
      const statusClass = record.status === "Present" ? "attendance-present" : "attendance-absent"
      attendanceTable += `
                <tr>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td class="${statusClass}">${record.status}</td>
                </tr>
            `
    })

    attendanceTable += "</tbody></table>"
    attendanceDiv.innerHTML = attendanceTable
  } else {
    attendanceDiv.innerHTML = "<p>No attendance records yet.</p>"
  }

  container.classList.remove("hidden")
}

// Display student data for students (same as child data)
function displayStudentData(student) {
  const container = document.getElementById("studentDataContainer")
  const infoDiv = document.getElementById("studentInfo")
  const marksDiv = document.getElementById("studentMarks")
  const attendanceDiv = document.getElementById("studentAttendance")

  // Student Info
  infoDiv.innerHTML = `
        <div style="background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
            <h4>My Information</h4>
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Roll Number:</strong> ${student.rollNumber}</p>
            <p><strong>Class:</strong> ${student.class}</p>
        </div>
    `

  // Marks
  if (student.marks && student.marks.length > 0) {
    let marksTable = `
            <h4>My Academic Performance</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
        `

    student.marks.forEach((mark) => {
      const grade = getGrade(mark.marks)
      marksTable += `
                <tr>
                    <td>${mark.subject}</td>
                    <td>${mark.marks}/100</td>
                    <td>${grade}</td>
                </tr>
            `
    })

    marksTable += "</tbody></table>"
    marksDiv.innerHTML = marksTable
  } else {
    marksDiv.innerHTML = "<p>No marks recorded yet.</p>"
  }

  // Attendance
  if (student.attendance && student.attendance.length > 0) {
    let attendanceTable = `
            <h4>My Attendance Record</h4>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `

    student.attendance.forEach((record) => {
      const statusClass = record.status === "Present" ? "attendance-present" : "attendance-absent"
      attendanceTable += `
                <tr>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td class="${statusClass}">${record.status}</td>
                </tr>
            `
    })

    attendanceTable += "</tbody></table>"
    attendanceDiv.innerHTML = attendanceTable
  } else {
    attendanceDiv.innerHTML = "<p>No attendance records yet.</p>"
  }

  container.classList.remove("hidden")
}

// Add or update student (for teachers)
async function addOrUpdateStudent() {
  const rollNumber = document.getElementById("studentRoll").value.trim()
  const name = document.getElementById("studentName").value.trim()
  const studentClass = document.getElementById("studentClass").value.trim()
  const subject = document.getElementById("subject").value
  const marks = document.getElementById("marks").value
  const attendance = document.getElementById("attendance").value

  if (!rollNumber || !name || !studentClass) {
    showAlert("Please fill in all required fields (Roll Number, Name, Class)", "error")
    return
  }

  const studentData = {
    rollNumber,
    name,
    class: studentClass,
  }

  if (subject && marks) {
    studentData.marks = { subject, marks: Number.parseInt(marks) }
  }

  if (attendance) {
    studentData.attendance = { status: attendance, date: new Date().toISOString() }
  }

  try {
    const response = await fetch(`${API_BASE}/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })

    const data = await response.json()

    if (data.success) {
      showAlert("Student data updated successfully!", "success")
      clearForm()
      loadAllStudents()
    } else {
      showAlert("Error updating student data", "error")
    }
  } catch (error) {
    console.error("Error:", error)
    showAlert("Error updating student data", "error")
  }
}

// Load all students (for teachers)
async function loadAllStudents() {
  try {
    const response = await fetch(`${API_BASE}/students`)
    const data = await response.json()

    if (data.success) {
      displayAllStudents(data.students)
    }
  } catch (error) {
    console.error("Error:", error)
    showAlert("Error loading students data", "error")
  }
}

// Display all students table
function displayAllStudents(students) {
  const container = document.getElementById("studentsTable")

  if (students.length === 0) {
    container.innerHTML = "<p>No students found.</p>"
    return
  }

  let table = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Subjects</th>
                    <th>Attendance Rate</th>
                </tr>
            </thead>
            <tbody>
    `

  students.forEach((student) => {
    const subjects = student.marks ? student.marks.map((m) => `${m.subject}: ${m.marks}`).join(", ") : "No marks"
    const attendanceRate = calculateAttendanceRate(student.attendance)

    table += `
            <tr>
                <td>${student.rollNumber}</td>
                <td>${student.name}</td>
                <td>${student.class}</td>
                <td>${subjects}</td>
                <td>${attendanceRate}%</td>
            </tr>
        `
  })

  table += "</tbody></table>"
  container.innerHTML = table
}

// Helper functions
function getGrade(marks) {
  if (marks >= 90) return "A+"
  if (marks >= 80) return "A"
  if (marks >= 70) return "B+"
  if (marks >= 60) return "B"
  if (marks >= 50) return "C"
  if (marks >= 40) return "D"
  return "F"
}

function calculateAttendanceRate(attendance) {
  if (!attendance || attendance.length === 0) return 0
  const presentDays = attendance.filter((record) => record.status === "Present").length
  return Math.round((presentDays / attendance.length) * 100)
}

function showAlert(message, type) {
  const container = document.getElementById("alertContainer")
  const alertDiv = document.createElement("div")
  alertDiv.className = `alert alert-${type}`
  alertDiv.textContent = message

  container.innerHTML = ""
  container.appendChild(alertDiv)

  setTimeout(() => {
    alertDiv.remove()
  }, 5000)
}

function clearForm() {
  document.getElementById("studentRoll").value = ""
  document.getElementById("studentName").value = ""
  document.getElementById("studentClass").value = ""
  document.getElementById("subject").value = ""
  document.getElementById("marks").value = ""
  document.getElementById("attendance").value = ""
}

function logout() {
  window.location.href = "/"
}
