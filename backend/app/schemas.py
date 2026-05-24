from pydantic import BaseModel
from typing import Optional, List


# ==================== EQUIPMENT FAILURE PREDICTOR ====================

class PredictiveMaintenanceRequest(BaseModel):
    air_temperature_k: float
    process_temperature_k: float
    rotational_speed_rpm: float
    torque_nm: float
    tool_wear: float
    type: str  # 'L', 'M', or 'H'


class PredictiveMaintenanceResponse(BaseModel):
    prediction: int
    prediction_text: str
    confidence: float
    risk_level: str
    model_info: Optional[str] = None
    history: Optional[List[float]] = None


# ==================== SYSTEM PERFORMANCE MONITOR ====================

class ServerMonitoringRequest(BaseModel):
    protocol_type: str
    service: str
    flag: str
    src_bytes: float
    dst_bytes: float
    logged_in: int
    count: int
    srv_count: int
    serror_rate: float
    rerror_rate: float


class ServerMonitoringResponse(BaseModel):
    prediction: int
    prediction_text: str
    confidence: float
    risk_level: str
    model_info: Optional[str] = None
    history: Optional[List[float]] = None


# ==================== STUDENT PERFORMANCE ANALYZER ====================

class StudentRiskRequest(BaseModel):
    age: float
    gender: Optional[str] = 'Male'
    family_income: float
    internet_access: Optional[str] = 'No'
    attendance_rate: float
    assignment_delay_days: Optional[float] = 0.0
    travel_time_minutes: Optional[float] = 30.0
    part_time_job: Optional[str] = 'No'
    scholarship: int = 0  # 0 or 1
    stress_index: float
    gpa: float
    semester_gpa: Optional[float] = 0.0
    cgpa: float
    semester: Optional[int] = 1
    department: Optional[str] = 'General'
    parental_education: Optional[float] = 12.0


class StudentRiskResponse(BaseModel):
    prediction: int
    prediction_text: str
    confidence: float
    risk_level: str
    model_info: Optional[str] = None
    history: Optional[List[float]] = None


# ==================== PATIENT HEALTH TRACKER ====================

class HealthMonitoringRequest(BaseModel):
    gender: str  # 'Male' or 'Female'
    age: float
    hypertension: int  # 0 or 1
    heart_disease: int  # 0 or 1
    ever_married: str  # 'Yes' or 'No'
    work_type: str
    residence_type: str  # 'Urban' or 'Rural'
    avg_glucose_level: float
    bmi: float
    smoking_status: str


class HealthMonitoringResponse(BaseModel):
    prediction: int
    prediction_text: str
    confidence: float
    risk_level: str
    model_info: Optional[str] = None
    history: Optional[List[float]] = None


# ==================== LOGISTICS OPTIMIZER ====================

class SupplyChainRequest(BaseModel):
    stock_levels: float
    lead_times: float
    order_quantities: float
    shipping_times: float
    shipping_costs: float
    production_volumes: float
    manufacturing_lead_time: float
    defect_rates: float
    supplier_name: Optional[str] = None
    transportation_mode: Optional[str] = None


class SupplyChainResponse(BaseModel):
    prediction: int
    prediction_text: str
    confidence: float
    risk_level: str
    model_info: Optional[str] = None
    history: Optional[List[float]] = None


# ==================== QUALITY CONTROL MONITOR ====================

class QualityAssuranceRequest(BaseModel):
    production_volume: float
    production_cost: float
    supplier_quality: float
    quality_score: float
    maintenance_hours: float
    downtime_percentage: float
    worker_productivity: float


class QualityAssuranceResponse(BaseModel):
    prediction: int
    prediction_text: str
    confidence: float
    risk_level: str
    model_info: Optional[str] = None
    history: Optional[List[float]] = None
