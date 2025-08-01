// Global variables
let currentRole = ""
const studentsData = []

// API base URL - removed trailing slash for consistency
const API_BASE = "https://1ba38310-01de-4603-9f40-863223f73021-00-2g0jet3252ffi.pike.replit.dev"

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
    // Added "/api" to URL path
    const response = await fetch(`${API_BASE}/api/student/${rollNumber}`)
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
    // Added "/api" to URL path
    const response = await fetch(`${API_BASE}/api/student/${rollNumber}`)
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
    // Added "/api" to URL path
    const response = await fetch(`${API_BASE}/api/student`, {
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
    // Added "/api" to URL path
    const response = await fetch(`${API_BASE}/api/students`)
    const data = await response.json()

    if (data.success) {
      displayAllStudents(data.students)
    }
  } catch (error) {
    console.error("Error:", error)
    showAlert("Error loading students data", "error")
  }
}

// The rest of the code including displayChildData, displayStudentData, displayAllStudents, helpers, showAlert, clearForm, logout remains unchanged.

...
// (No change needed for functions: displayChildData, displayStudentData, displayAllStudents, getGrade, calculateAttendanceRate, showAlert, clearForm, logout)
