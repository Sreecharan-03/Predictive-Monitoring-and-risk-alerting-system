from fastapi import APIRouter, HTTPException
from app.schemas import HealthMonitoringRequest, HealthMonitoringResponse
from app.models import model_manager

router = APIRouter(prefix="/health-tracker", tags=["Patient Health Tracker"])


def _encode_category(value, mapping, default=0):
    if isinstance(value, (int, float)):
        return int(value)
    if value is None:
        return default
    return mapping.get(str(value).strip().lower(), default)

@router.post("/predict", response_model=HealthMonitoringResponse)
async def predict_health_risk(request: HealthMonitoringRequest):
    """
    Predict patient health risk
    Features: gender, age, hypertension, heart_disease, ever_married, work_type, Residence_type, avg_glucose_level, bmi, smoking_status
    """
    try:
        # Match the notebook's LabelEncoder order: alphabetical categories.
        gender_map = {'female': 0, 'male': 1, 'other': 2}
        married_map = {'no': 0, 'yes': 1}
        work_map = {'govt_job': 0, 'never_worked': 1, 'private': 2, 'self-employed': 3, 'children': 4}
        residence_map = {'rural': 0, 'urban': 1}
        smoke_map = {'unknown': 0, 'formerly smoked': 1, 'never smoked': 2, 'smokes': 3}

        gender_val = _encode_category(request.gender, gender_map, 0)
        married_val = _encode_category(request.ever_married, married_map, 0)
        work_val = _encode_category(request.work_type, work_map, 0)
        residence_val = _encode_category(request.residence_type, residence_map, 0)
        smoke_val = _encode_category(request.smoking_status, smoke_map, 0)

        features_dict = {
            "gender": gender_val,
            "age": request.age,
            "hypertension": request.hypertension,
            "heart_disease": request.heart_disease,
            "ever_married": married_val,
            "work_type": work_val,
            "residence_type": residence_val,
            "avg_glucose_level": request.avg_glucose_level,
            "bmi": request.bmi,
            "smoking_status": smoke_val
        }
        
        result = model_manager.predict('health_monitoring', features_dict)
        
        return HealthMonitoringResponse(
            prediction=result['prediction'],
            prediction_text=result['prediction_text'],
            confidence=result['confidence'],
            risk_level=result['risk_level'],
            model_info=result.get('model_info'),
            history=result.get('history')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
