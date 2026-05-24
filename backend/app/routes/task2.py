from fastapi import APIRouter, HTTPException, Body
from app.schemas import ServerMonitoringResponse
from app.models import model_manager

router = APIRouter(prefix="/server-monitoring", tags=["System Performance Monitor"])

@router.post("/predict", response_model=ServerMonitoringResponse)
async def predict_server_monitoring(request_body: dict = Body(...)):
    """
    Predict server downtime based on system metrics
    Features: Air Temperature, Process Temperature, Rotational Speed, Torque, Type
    """
    try:
        # Accept either the new dataset fields or the legacy predictive fields.
        rb = request_body or {}

        def pick(*keys, cast=None, default=None):
            for k in keys:
                if k in rb and rb[k] is not None:
                    v = rb[k]
                    try:
                        return cast(v) if cast else v
                    except Exception:
                        return v
            return default

        features_dict = {
            "protocol_type": pick('protocol_type', 'protocol', default='tcp'),
            "service": pick('service', default='http'),
            "flag": pick('flag', default='SF'),
            "src_bytes": pick('src_bytes', cast=float, default=0.0),
            "dst_bytes": pick('dst_bytes', cast=float, default=0.0),
            "logged_in": pick('logged_in', cast=int, default=0),
            "count": pick('count', cast=float, default=0.0),
            "srv_count": pick('srv_count', cast=float, default=0.0),
            "serror_rate": pick('serror_rate', cast=float, default=0.0),
            "srv_serror_rate": pick('srv_serror_rate', cast=float, default=0.0),
            "same_srv_rate": pick('same_srv_rate', cast=float, default=0.0),
            "diff_srv_rate": pick('diff_srv_rate', cast=float, default=0.0),
            "dst_host_count": pick('dst_host_count', cast=float, default=0.0),
            "dst_host_srv_count": pick('dst_host_srv_count', cast=float, default=0.0),
            "dst_host_same_srv_rate": pick('dst_host_same_srv_rate', cast=float, default=0.0),
            "dst_host_diff_srv_rate": pick('dst_host_diff_srv_rate', cast=float, default=0.0),
            "dst_host_serror_rate": pick('dst_host_serror_rate', cast=float, default=0.0),
            "dst_host_srv_serror_rate": pick('dst_host_srv_serror_rate', cast=float, default=0.0),
            "rerror_rate": pick('rerror_rate', cast=float, default=0.0),
            "srv_rerror_rate": pick('srv_rerror_rate', cast=float, default=0.0)
        }

        result = model_manager.predict('server_monitoring', features_dict)
        
        return ServerMonitoringResponse(
            prediction=result['prediction'],
            prediction_text=result['prediction_text'],
            confidence=result['confidence'],
            risk_level=result['risk_level'],
            model_info=result.get('model_info'),
            history=result.get('history')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
