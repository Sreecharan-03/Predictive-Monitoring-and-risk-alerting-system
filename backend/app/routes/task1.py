from fastapi import APIRouter, HTTPException
from app.schemas import PredictiveMaintenanceRequest, PredictiveMaintenanceResponse
from app.models import model_manager

router = APIRouter(prefix="/predictive-maintenance", tags=["Equipment Failure Predictor"])

@router.post("/predict", response_model=PredictiveMaintenanceResponse)
async def predict_equipment_failure(request: PredictiveMaintenanceRequest):
    """
    Predict machine failure based on equipment parameters
    Features: Air Temperature, Process Temperature, Rotational Speed, Torque, Type
    """
    try:
        # Map request fields to model feature names
        features_dict = {
            "Air temperature [K]": request.air_temperature_k,
            "Process temperature [K]": request.process_temperature_k,
            "Rotational speed [rpm]": request.rotational_speed_rpm,
            "Torque [Nm]": request.torque_nm,
            "Tool wear [min]": request.tool_wear,
            "Type": request.type if isinstance(request.type, (int, float)) else (0 if request.type == 'L' else (1 if request.type == 'M' else 2))
        }
        
        result = model_manager.predict('predictive_maintenance', features_dict)
        
        return PredictiveMaintenanceResponse(
            prediction=result['prediction'],
            prediction_text=result['prediction_text'],
            confidence=result['confidence'],
            risk_level=result['risk_level'],
            model_info=result.get('model_info'),
            history=result.get('history')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
