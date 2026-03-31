import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudents, deleteStudent } from '../utils/studentData';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const allStudents = await getStudents();
      const sortedStudents = [...allStudents].sort((a, b) => {
        const aId = parseInt((a.studentId || '').replace(/\D/g, ''), 10) || 0;
        const bId = parseInt((b.studentId || '').replace(/\D/g, ''), 10) || 0;
        return bId - aId;
      });
      setStudents(sortedStudents);
    } catch {
      setStudents([]);
    }
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.studentName || '';
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.studentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse = !filterCourse || student.course === filterCourse;
    const matchesStatus = !filterStatus || student.studentStatus === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  const handleDelete = async (studentId) => {
    await deleteStudent(studentId);
    await loadStudents();
    setShowDeleteConfirm(false);
    setSelectedStudent(null);
  };

  const courses = [...new Set(students.map((s) => s.course))].filter(Boolean);
  const statuses = [...new Set(students.map((s) => s.studentStatus))].filter(Boolean);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
            <button className="btn btn-primary" onClick={() => navigate('/student-info/add-student')}>
              Add Student
            </button>
            <h1 className="h4 m-0">Manage Students</h1>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/student-info')}>
              Student info / Student List
            </button>
          </div>

          <div className="row g-2 align-items-end mb-3">
            <div className="col-md-5">
              <label className="form-label">Search</label>
              <input
                className="form-control"
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Course</label>
              <select
                className="form-select"
                value={filterCourse}
                onChange={(e) => {
                  setFilterCourse(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-1 text-md-end text-muted small">
              {filteredStudents.length}/{students.length}
            </div>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-5 border rounded">
              <h2 className="h5">No Students Found</h2>
              <p className="text-muted">Start by adding your first student</p>
              <button className="btn btn-success" onClick={() => navigate('/student-info/add-student')}>
                Add Student
              </button>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {paginatedStudents.map((student) => (
                  <div key={student.studentId} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h3 className="h6 mb-1">
                              {(`${student.firstName || ''} ${student.lastName || ''}`.trim() || student.studentName || 'N/A')}
                            </h3>
                            <div className="text-muted small">{student.studentId}</div>
                          </div>
                          <span className="badge text-bg-info">{student.studentStatus}</span>
                        </div>
                        <ul className="list-unstyled small mb-3">
                          <li><strong>Course:</strong> {student.course || 'N/A'}</li>
                          <li><strong>Email:</strong> {student.email || 'N/A'}</li>
                          <li><strong>Contact:</strong> {student.contactNumber || 'N/A'}</li>
                          <li><strong>Mentor:</strong> {student.mentor || 'N/A'}</li>
                          <li><strong>Total:</strong> Rs {student.totalAmount || 0}</li>
                          <li><strong>Remaining:</strong> Rs {student.remainingAmount || 0}</li>
                        </ul>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedStudent(student)}>
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => navigate(`/student-info/edit-student/${student.studentId}`)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowDeleteConfirm(true);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                  <button className="btn btn-outline-secondary" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                  </button>
                  <span className="small text-muted">Page {currentPage} of {totalPages}</span>
                  <button className="btn btn-outline-secondary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedStudent && !showDeleteConfirm && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedStudent(null)}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title fs-5">Student Details</h2>
              <button className="btn-close" onClick={() => setSelectedStudent(null)}>
              </button>
            </div>

            <div className="modal-body">
              {selectedStudent.studentImage && <img src={selectedStudent.studentImage} alt={selectedStudent.firstName || selectedStudent.studentName || 'Student'} className="img-fluid rounded mb-3" />}

              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Student ID:</span>
                    <span className="value">{selectedStudent.studentId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Name:</span>
                    <span className="value">
                      {(`${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim() || selectedStudent.studentName || 'N/A')}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Father:</span>
                    <span className="value">{selectedStudent.fatherName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Mother:</span>
                    <span className="value">{selectedStudent.motherName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">DOB:</span>
                    <span className="value">{selectedStudent.dob}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Gender:</span>
                    <span className="value">{selectedStudent.gender}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Marital Status:</span>
                    <span className="value">{selectedStudent.maritalStatus}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span className="value">{selectedStudent.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Contact:</span>
                    <span className="value">{selectedStudent.contactNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Alternate:</span>
                    <span className="value">{selectedStudent.alternateNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Address:</span>
                    <span className="value">{selectedStudent.address}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Academic Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Qualification:</span>
                    <span className="value">{selectedStudent.qualification}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Experience:</span>
                    <span className="value">{selectedStudent.workExperience || 0} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Course:</span>
                    <span className="value">{selectedStudent.course}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Joining Date:</span>
                    <span className="value">{selectedStudent.dateOfJoining}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Mentor:</span>
                    <span className="value">{selectedStudent.mentor}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className="value">{selectedStudent.studentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Financial Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Total Amount:</span>
                    <span className="value">₹{selectedStudent.totalAmount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Remaining Amount:</span>
                    <span className="value">₹{selectedStudent.remainingAmount || 0}</span>
                  </div>
                </div>
              </div>

              {selectedStudent.remarks && (
                <div className="detail-section">
                  <h3>Remarks</h3>
                  <p>{selectedStudent.remarks}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedStudent(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {showDeleteConfirm && selectedStudent && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-body text-center">
                <h2 className="h5">Delete Student</h2>
                <p>
                  Are you sure you want to delete <strong>{(`${selectedStudent.firstName || ''} ${selectedStudent.lastName || ''}`.trim() || selectedStudent.studentName || 'this student')}</strong>?
                </p>
                <p className="text-danger small">This action cannot be undone.</p>
                <div className="d-flex justify-content-center gap-2">
                  <button className="btn btn-danger" onClick={() => handleDelete(selectedStudent.studentId)}>
                    Yes, Delete
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
