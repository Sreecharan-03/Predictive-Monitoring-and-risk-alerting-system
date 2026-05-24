from fastapi import APIRouter, HTTPException
from app.schemas import StudentRiskRequest, StudentRiskResponse
from app.models import model_manager

router = APIRouter(prefix="/student-analyzer", tags=["Student Performance Analyzer"])


def _encode_category(value, mapping, default=0):
    if isinstance(value, (int, float)):
        return int(value)
    if value is None:
        return default
    return mapping.get(str(value).strip().lower(), default)

@router.post("/predict", response_model=StudentRiskResponse)
async def predict_student_dropout(request: StudentRiskRequest):
    """
    Predict student dropout risk
    Features: Age, Family_Income, Attendance_Rate, GPA, CGPA, Scholarship, Stress_Index
    """
    try:
        # Match the notebook's LabelEncoder order: alphabetical categories.
        gender_map = {'female': 0, 'male': 1}
        internet_map = {'no': 0, 'yes': 1}
        part_time_map = {'no': 0, 'yes': 1}
        dept_map = {'arts': 0, 'business': 1, 'cs': 2, 'engineering': 3, 'science': 4}

        gender_val = _encode_category(getattr(request, 'gender', 'Male'), gender_map, 0)
        internet_val = _encode_category(getattr(request, 'internet_access', 'No'), internet_map, 0)
        part_time_val = _encode_category(getattr(request, 'part_time_job', 'No'), part_time_map, 0)
        dept_val = _encode_category(getattr(request, 'department', 'Arts'), dept_map, 0)

        # Build a complete features dict (frontend keys) to match model training columns
        features_dict = {
            "Age": request.age,
            "Gender": gender_val,
            "Family_Income": request.family_income,
            "Internet_Access": internet_val,
            "Attendance_Rate": request.attendance_rate,
            "Assignment_Delay_Days": getattr(request, 'assignment_delay_days', 0.0),
            "Travel_Time_Minutes": getattr(request, 'travel_time_minutes', 30.0),
            "Part_Time_Job": part_time_val,
            "Scholarship": request.scholarship,
            "Stress_Index": request.stress_index,
            "GPA": request.gpa,
            "Semester_GPA": getattr(request, 'semester_gpa', 0.0),
            "CGPA": request.cgpa,
            "Semester": getattr(request, 'semester', 1),
            "Department": dept_val,
            "Parental_Education": getattr(request, 'parental_education', 12.0)
        }
        
        result = model_manager.predict('student_risk', features_dict)
        
        return StudentRiskResponse(
            prediction=result['prediction'],
            prediction_text=result['prediction_text'],
            confidence=result['confidence'],
            risk_level=result['risk_level'],
            model_info=result.get('model_info'),
            history=result.get('history')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
