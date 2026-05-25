from app.models import model_manager
features={'production_volume':1000,'production_cost':5000,'supplier_quality':0.9,'quality_score':85,'maintenance_hours':10,'downtime_percentage':2.5,'worker_productivity':75}
try:
    res=model_manager.predict('quality_assurance',features)
    print('OK',res)
except Exception as e:
    print('ERR',repr(e))
