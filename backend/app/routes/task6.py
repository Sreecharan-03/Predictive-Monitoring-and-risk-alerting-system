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
        # Use the centralized model manager which handles lazy loading,
        # feature mapping and scalers/encoders for consistency.
        features = {
            'production_volume': request.production_volume,
            'production_cost': request.production_cost,
            'supplier_quality': request.supplier_quality,
            'quality_score': request.quality_score,
            'maintenance_hours': request.maintenance_hours,
            'downtime_percentage': request.downtime_percentage,
            'worker_productivity': request.worker_productivity,
        }

        result = model_manager.predict('quality_assurance', features)

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
