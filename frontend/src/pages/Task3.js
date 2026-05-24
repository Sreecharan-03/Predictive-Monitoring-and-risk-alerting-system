import React, { useState } from 'react';
import axios from 'axios';
import PredictionCard from '../components/PredictionCard';
import { FaGraduationCap, FaSpinner, FaBook, FaCalendarAlt, FaDollarSign, FaExclamationCircle, FaUsers } from 'react-icons/fa';
import './TaskPage.css';
import { apiUrl } from '../config/api';

function Task3() {
  const [formData, setFormData] = useState({
    age: '',
    gpa: '',
    attendance_rate: '',
    scholarship: 0,
    family_income: '',
    cgpa: '',
    stress_index: '',
    gender: 'Male',
    internet_access: 'Yes',
    assignment_delay_days: 0.0,
    travel_time_minutes: 30.0,
    part_time_job: 'No',
    semester_gpa: '',
    semester: 1,
    department: 'Engineering',
    parental_education: 12.0
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = {
        gender: formData.gender,
        age: parseFloat(formData.age),
        family_income: parseFloat(formData.family_income),
        internet_access: formData.internet_access,
        attendance_rate: parseFloat(formData.attendance_rate),
        assignment_delay_days: parseFloat(formData.assignment_delay_days),
        travel_time_minutes: parseFloat(formData.travel_time_minutes),
        part_time_job: formData.part_time_job,
        scholarship: parseFloat(formData.scholarship),
        stress_index: parseFloat(formData.stress_index),
        gpa: parseFloat(formData.gpa),
        semester_gpa: parseFloat(formData.semester_gpa || 0.0),
        cgpa: parseFloat(formData.cgpa),
        semester: parseInt(formData.semester || 1),
        department: formData.department,
        parental_education: parseFloat(formData.parental_education)
      };
      
      const response = await axios.post(apiUrl('/api/predict/student-analyzer/predict'), data);
      setPrediction(response.data);
    } catch (err) {
      setError('Error making prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-page fade-in">
      <div className="task-header">
        <div className="header-content">
          <h1><FaGraduationCap className="header-icon" /> Student Performance Analyzer</h1>
          <p>Identify at-risk students early and provide targeted intervention support</p>
        </div>
      </div>

      <div className="container">
        <div className="task-content">
          <div className="form-section">
            <h2>Enter Student Information</h2>
            <form onSubmit={handleSubmit} className="prediction-form">
              <div className="form-group">
                <label htmlFor="age">
                  <FaCalendarAlt /> Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 20"
                  step="1"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gpa">
                  <FaBook /> Current GPA
                </label>
                <input
                  type="number"
                  id="gpa"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="e.g., 3.5"
                  step="0.1"
                  min="0"
                  max="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">
                  Gender
                </label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="internet_access">Internet Access</label>
                <select id="internet_access" name="internet_access" value={formData.internet_access} onChange={handleChange}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="assignment_delay_days">Assignment Delay Days</label>
                <input type="number" id="assignment_delay_days" name="assignment_delay_days" value={formData.assignment_delay_days} onChange={handleChange} step="0.1" />
              </div>

              <div className="form-group">
                <label htmlFor="travel_time_minutes">Travel Time (minutes)</label>
                <input type="number" id="travel_time_minutes" name="travel_time_minutes" value={formData.travel_time_minutes} onChange={handleChange} step="1" />
              </div>

              <div className="form-group">
                <label htmlFor="part_time_job">Part-time Job</label>
                <select id="part_time_job" name="part_time_job" value={formData.part_time_job} onChange={handleChange}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="semester_gpa">Semester GPA</label>
                <input type="number" id="semester_gpa" name="semester_gpa" value={formData.semester_gpa} onChange={handleChange} step="0.1" />
              </div>

              <div className="form-group">
                <label htmlFor="semester">Semester</label>
                <input type="number" id="semester" name="semester" value={formData.semester} onChange={handleChange} step="1" min="1" />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select id="department" name="department" value={formData.department} onChange={handleChange}>
                  <option>Arts</option>
                  <option>Engineering</option>
                  <option>CS</option>
                  <option>Business</option>
                  <option>Science</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="parental_education">Parental Education (years)</label>
                <input type="number" id="parental_education" name="parental_education" value={formData.parental_education} onChange={handleChange} step="1" />
              </div>

              <div className="form-group">
                <label htmlFor="attendance_rate">
                  <FaCalendarAlt /> Attendance Rate (%)
                </label>
                <input
                  type="number"
                  id="attendance_rate"
                  name="attendance_rate"
                  value={formData.attendance_rate}
                  onChange={handleChange}
                  placeholder="e.g., 85"
                  step="0.1"
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="scholarship">
                  <FaDollarSign /> Scholarship (0 = None, 1 = Yes)
                </label>
                <select
                  id="scholarship"
                  name="scholarship"
                  value={formData.scholarship}
                  onChange={handleChange}
                >
                  <option value="0">No Scholarship</option>
                  <option value="1">Has Scholarship</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="family_income">
                  <FaDollarSign /> Family Income
                </label>
                <input
                  type="number"
                  id="family_income"
                  name="family_income"
                  value={formData.family_income}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  step="1000"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="cgpa">
                  <FaBook /> Cumulative GPA (CGPA)
                </label>
                <input
                  type="number"
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g., 3.4"
                  step="0.1"
                  min="0"
                  max="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="stress_index">
                  <FaExclamationCircle /> Stress Index (1-10)
                </label>
                <input
                  type="number"
                  id="stress_index"
                  name="stress_index"
                  value={formData.stress_index}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  step="0.1"
                  min="1"
                  max="10"
                  required
                />
              </div>

              <button type="submit" className="form-submit" disabled={loading}>
                {loading ? (
                  <>
                    <FaSpinner className="spinner" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaGraduationCap /> Analyze Dropout Risk
                  </>
                )}
              </button>
            </form>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="info-section">
            <h3>About This Model</h3>
            <p>The Student Performance Analyzer uses machine learning to identify students at risk of dropping out based on academic, financial, and personal factors.</p>
            
            <h3 style={{marginTop: '25px'}}>Key Indicators</h3>
            <ul className="features-list">
              <li><FaBook /> Academic Performance (GPA & CGPA)</li>
              <li><FaCalendarAlt /> Attendance Patterns</li>
              <li><FaDollarSign /> Financial Status</li>
              <li><FaExclamationCircle /> Stress Levels</li>
              <li><FaUsers /> Family Support</li>
            </ul>

            {prediction && (
              <div className="prediction-result">
                <h3 style={{marginTop: '25px'}}>Risk Assessment</h3>
                <PredictionCard
                  prediction={{ value: prediction.prediction, history: (prediction.history || null), modelInfo: prediction.model_info || 'Learns from past student records to flag those who may need support.' }}
                  predictionText={prediction.prediction_text}
                  confidence={(prediction.confidence || 0) / 100}
                  riskLevel={(() => {
                    const rl = prediction.risk_level || '';
                    if (typeof rl === 'string') {
                      const lower = rl.toLowerCase();
                      if (lower.includes('high')) return 'High';
                      if (lower.includes('medium')) return 'Medium';
                    }
                    return 'Low';
                  })()}
                  title="Student Risk Analysis"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Task3;
