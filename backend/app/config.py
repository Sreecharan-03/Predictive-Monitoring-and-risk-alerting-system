"""
Configuration file for all 6 prediction tasks
"""

TASKS_CONFIG = {
    "predictive_maintenance": {
        "name": "Equipment Failure Predictor",
        "description": "Predict machine failures using temperature, speed, and torque",
        "model_path": "../task-1/model.pkl",
        "features": ["Air temperature [K]", "Process temperature [K]", "Rotational speed [rpm]", "Torque [Nm]", "Tool wear [min]", "Type"],
        "frontend_mapping": {
            "air_temperature": "Air temperature [K]",
            "process_temperature": "Process temperature [K]",
            "rotational_speed": "Rotational speed [rpm]",
            "torque": "Torque [Nm]",
            "type": "Type",
            "tool_wear": "Tool wear [min]"
        },
        "type_mapping": {"L": 0, "M": 1, "H": 2}
    },
    "server_monitoring": {
        "name": "System Performance Monitor",
        "description": "Monitor server performance and predict downtime risk",
        "model_path": "../task-2/model.pkl",
        "dataset_path": "../task-2/Train_data.csv",
        "features": [
            "protocol_type", "service", "flag", "src_bytes", "dst_bytes",
            "logged_in", "count", "srv_count", "serror_rate", "srv_serror_rate",
            "same_srv_rate", "diff_srv_rate", "dst_host_count", "dst_host_srv_count",
            "dst_host_same_srv_rate", "dst_host_diff_srv_rate", "dst_host_serror_rate",
            "dst_host_srv_serror_rate", "rerror_rate", "srv_rerror_rate"
        ],
        "frontend_mapping": {
            "protocol_type": "protocol_type",
            "service": "service",
            "flag": "flag",
            "src_bytes": "src_bytes",
            "dst_bytes": "dst_bytes",
            "logged_in": "logged_in",
            "count": "count",
            "srv_count": "srv_count",
            "serror_rate": "serror_rate",
            "srv_serror_rate": "srv_serror_rate",
            "same_srv_rate": "same_srv_rate",
            "diff_srv_rate": "diff_srv_rate",
            "dst_host_count": "dst_host_count",
            "dst_host_srv_count": "dst_host_srv_count",
            "dst_host_same_srv_rate": "dst_host_same_srv_rate",
            "dst_host_diff_srv_rate": "dst_host_diff_srv_rate",
            "dst_host_serror_rate": "dst_host_serror_rate",
            "dst_host_srv_serror_rate": "dst_host_srv_serror_rate",
            "rerror_rate": "rerror_rate",
            "srv_rerror_rate": "srv_rerror_rate"
        },
        "encoder_path": "../task-2/label_encoder.pkl"
    },
    "student_risk": {
        "name": "Student Performance Analyzer",
        "description": "Assess student dropout risk and intervention needs",
        "model_path": "../task-3/model.pkl",
        "features": [
            "Age", "Gender", "Family_Income", "Internet_Access", "Attendance_Rate",
            "Assignment_Delay_Days", "Travel_Time_Minutes", "Part_Time_Job", "Scholarship",
            "Stress_Index", "GPA", "Semester_GPA", "CGPA", "Semester", "Department", "Parental_Education"
        ],
        "frontend_mapping": {
            "age": "Age",
            "gender": "Gender",
            "family_income": "Family_Income",
            "internet_access": "Internet_Access",
            "attendance_rate": "Attendance_Rate",
            "assignment_delay_days": "Assignment_Delay_Days",
            "travel_time_minutes": "Travel_Time_Minutes",
            "part_time_job": "Part_Time_Job",
            "scholarship": "Scholarship",
            "stress_index": "Stress_Index",
            "gpa": "GPA",
            "semester_gpa": "Semester_GPA",
            "cgpa": "CGPA",
            "semester": "Semester",
            "department": "Department",
            "parental_education": "Parental_Education"
        }
    },
    "health_monitoring": {
        "name": "Patient Health Tracker",
        "description": "Monitor patient health indicators and stroke risk",
        "model_path": "../task-4/stroke_model.pkl",
        "scaler_path": "../task-4/scaler.pkl",
        "features": [
            "gender", "age", "hypertension", "heart_disease", "ever_married",
            "work_type", "Residence_type", "avg_glucose_level", "bmi", "smoking_status"
        ],
        "frontend_mapping": {
            "gender": "gender",
            "age": "age",
            "hypertension": "hypertension",
            "heart_disease": "heart_disease",
            "ever_married": "ever_married",
            "work_type": "work_type",
            "residence_type": "Residence_type",
            "avg_glucose_level": "avg_glucose_level",
            "bmi": "bmi",
            "smoking_status": "smoking_status"
        }
    },
    "supply_chain": {
        "name": "Logistics Optimizer",
        "description": "Optimize supply chain and predict disruption risks",
        "model_path": "../task-5/model.pkl",
        "features": [
            "Stock levels", "Lead times", "Order quantities", "Shipping times",
            "Shipping costs", "Supplier name_Supplier 1", "Supplier name_Supplier 2",
            "Supplier name_Supplier 3", "Supplier name_Supplier 4", "Supplier name_Supplier 5",
            "Transportation modes_Air", "Transportation modes_Rail", "Transportation modes_Road",
            "Transportation modes_Sea", "Production volumes", "Manufacturing lead time", "Defect rates"
        ],
        "frontend_mapping": {
            "stock_levels": "Stock levels",
            "lead_times": "Lead times",
            "order_quantities": "Order quantities",
            "shipping_times": "Shipping times",
            "shipping_costs": "Shipping costs",
            "production_volumes": "Production volumes",
            "manufacturing_lead_time": "Manufacturing lead time",
            "defect_rates": "Defect rates",
            "supplier_name": "Supplier name",
            "transportation_mode": "Transportation modes"
        }
    },
    "quality_assurance": {
        "name": "Quality Control Monitor",
        "description": "Monitor manufacturing quality and detect defects early",
        "model_path": "../task-6/model.pkl",
        "features": ["ProductionVolume", "ProductionCost", "SupplierQuality", "QualityScore", "MaintenanceHours", "DowntimePercentage", "WorkerProductivity"],
        "frontend_mapping": {
            "production_volume": "ProductionVolume",
            "production_cost": "ProductionCost",
            "supplier_quality": "SupplierQuality",
            "quality_score": "QualityScore",
            "maintenance_hours": "MaintenanceHours",
            "downtime_percentage": "DowntimePercentage",
            "worker_productivity": "WorkerProductivity"
        }
    }
}
