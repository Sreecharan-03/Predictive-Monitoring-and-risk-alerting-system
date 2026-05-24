from fastapi import APIRouter, HTTPException
from app.schemas import SupplyChainRequest, SupplyChainResponse
from app.models import model_manager

router = APIRouter(prefix="/logistics-optimizer", tags=["Logistics Optimizer"])

@router.post("/predict", response_model=SupplyChainResponse)
async def predict_supply_chain_risk(request: SupplyChainRequest):
    """
    Predict supply chain disruption risk
    Features: Stock Levels, Lead Times, Order Quantities, Shipping Times, Shipping Costs, 
              Production Volumes, Manufacturing Lead Time, Defect Rates
    """
    try:
        # Build a features dict matching the model's expected feature names (including one-hot columns)
        features_dict = {}
        model = model_manager.models.get('supply_chain')
        feature_names = None
        if model is not None and hasattr(model, 'feature_names_in_'):
            feature_names = list(model.feature_names_in_)

        # Fallback to config list if model metadata is not available
        if not feature_names:
            feature_names = [
                "Stock levels", "Lead times", "Order quantities", "Shipping times",
                "Shipping costs", "Production volumes", "Manufacturing lead time", "Defect rates"
            ]

        # Map basic numeric fields
        numeric_map = {
            "Stock levels": request.stock_levels,
            "Lead times": request.lead_times,
            "Order quantities": request.order_quantities,
            "Shipping times": request.shipping_times,
            "Shipping costs": request.shipping_costs,
            "Production volumes": request.production_volumes,
            "Manufacturing lead time": request.manufacturing_lead_time,
            "Defect rates": request.defect_rates
        }

        for fname in feature_names:
            if fname in numeric_map:
                features_dict[fname] = numeric_map[fname]
            elif fname.startswith('Supplier name_'):
                # One-hot encode supplier
                supplier_label = fname.split('Supplier name_')[-1]
                features_dict[fname] = 1.0 if request.supplier_name == supplier_label else 0.0
            elif fname.startswith('Transportation modes_'):
                tm_label = fname.split('Transportation modes_')[-1]
                features_dict[fname] = 1.0 if request.transportation_mode == tm_label else 0.0
            else:
                # Unknown column - default to 0
                features_dict[fname] = 0.0

        result = model_manager.predict('supply_chain', features_dict)
        
        return SupplyChainResponse(
            prediction=result['prediction'],
            prediction_text=result['prediction_text'],
            confidence=result['confidence'],
            risk_level=result['risk_level'],
            model_info=result.get('model_info'),
            history=result.get('history')
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
