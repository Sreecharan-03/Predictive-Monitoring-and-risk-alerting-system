from fastapi import APIRouter, HTTPException
from pathlib import Path
import pickle
import numpy as np
from app.schemas import QualityAssuranceRequest, QualityAssuranceResponse
from app.models import model_manager

router = APIRouter(prefix="/quality-monitor", tags=["Quality Control Monitor"])

@router.post("/predict", response_model=QualityAssuranceResponse)
async def predict_quality_defect(request: QualityAssuranceRequest):
    """
    Predict manufacturing quality defects
    Features: Production Volume, Production Cost, Supplier Quality, Quality Score,
              Maintenance Hours, Downtime Percentage, Worker Productivity
    """
    try:
        # Load the model directly if needed, then score the exact training feature order.
        model = model_manager.models.get('quality_assurance')
        if model is None:
            model_path = Path(__file__).resolve().parents[2] / 'task-6' / 'model.pkl'
            with open(model_path, 'rb') as handle:
                model = pickle.load(handle)
            model_manager.models['quality_assurance'] = model

        features_dict = {
            "ProductionVolume": request.production_volume,
            "ProductionCost": request.production_cost,
            "SupplierQuality": request.supplier_quality,
            "QualityScore": request.quality_score,
            "MaintenanceHours": request.maintenance_hours,
            "DowntimePercentage": request.downtime_percentage,
            "WorkerProductivity": request.worker_productivity
        }

        feature_order = [
            "ProductionVolume",
            "ProductionCost",
            "SupplierQuality",
            "QualityScore",
            "MaintenanceHours",
            "DowntimePercentage",
            "WorkerProductivity",
        ]
        feature_array = np.array([[float(features_dict[name]) for name in feature_order]])

        prediction = int(model.predict(feature_array)[0])
        if hasattr(model, 'predict_proba'):
            confidence = float(max(model.predict_proba(feature_array)[0]) * 100)
        else:
            confidence = 85.5

        result = {
            'prediction': prediction,
            'prediction_text': model_manager._get_prediction_text('quality_assurance', prediction),
            'confidence': round(confidence, 2),
            'risk_level': model_manager._get_risk_level(prediction, confidence),
        }
        
        return QualityAssuranceResponse(
            prediction=result['prediction'],
            prediction_text=result['prediction_text'],
            confidence=result['confidence'],
            risk_level=result['risk_level'],
            model_info=result.get('model_info'),
            history=result.get('history')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
