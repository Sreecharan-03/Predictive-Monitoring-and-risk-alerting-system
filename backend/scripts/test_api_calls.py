import requests
base = 'http://localhost:8000'
endpoints = {
    'predictive_maintenance': ('/api/predict/predictive-maintenance/predict', {"air_temperature_k":300.0,"process_temperature_k":310.0,"rotational_speed_rpm":2500.0,"torque_nm":40.0,"tool_wear":30.0,"type":"L"}),
    'server_monitoring': ('/api/predict/server-monitoring/predict', {"air_temperature_k":300.0,"process_temperature_k":310.0,"rotational_speed_rpm":2500.0,"torque_nm":40.0,"tool_wear":30.0,"type":"L"}),
    'student_risk': ('/api/predict/student-analyzer/predict', {"age":20.0,"gender":"Male","family_income":40000.0,"internet_access":1,"attendance_rate":90.0,"assignment_delay_days":0.0,"travel_time_minutes":30.0,"part_time_job":0,"scholarship":0,"stress_index":20.0,"gpa":3.2,"semester_gpa":3.0,"cgpa":3.1,"semester":3,"department":"Engineering","parental_education":16.0}),
    'health_monitoring': ('/api/predict/health-tracker/predict', {"gender":"Male","age":60.0,"hypertension":1,"heart_disease":0,"ever_married":"Yes","work_type":"Private","residence_type":"Urban","avg_glucose_level":140.0,"bmi":28.0,"smoking_status":"never smoked"}),
    'supply_chain': ('/api/predict/logistics-optimizer/predict', {"stock_levels":1000.0,"lead_times":15.0,"order_quantities":500.0,"shipping_times":7.0,"shipping_costs":500.0,"production_volumes":2000.0,"manufacturing_lead_time":10.0,"defect_rates":2.5}),
    'quality_assurance': ('/api/predict/quality-monitor/predict', {"production_volume":10000.0,"production_cost":50000.0,"supplier_quality":0.95,"quality_score":87.0,"maintenance_hours":12.0,"downtime_percentage":2.5,"worker_productivity":75.0})
}

for name, (path, payload) in endpoints.items():
    url = base + path
    try:
        r = requests.post(url, json=payload, timeout=10)
        print('---', name, '->', url)
        print('status', r.status_code)
        print(r.json())
    except Exception as e:
        print('---', name, 'ERROR:', e)
