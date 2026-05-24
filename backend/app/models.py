import pickle
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from .config import TASKS_CONFIG


class ModelManager:
    """Manages all ML models for predictions"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.category_maps = {}
        self.load_models()

    def _build_server_monitoring_maps(self, dataset_path):
        """Build categorical mappings that match the Task 2 notebook preprocessing."""
        try:
            df = pd.read_csv(dataset_path)
            top_6_services = df['service'].value_counts().nlargest(6).index
            top_5_flags = df['flag'].value_counts().nlargest(5).index

            protocol_values = sorted(df['protocol_type'].dropna().astype(str).unique().tolist())
            service_values = sorted(df['service'].apply(lambda x: x if x in top_6_services else 'other').dropna().astype(str).unique().tolist())
            flag_values = sorted(df['flag'].apply(lambda x: x if x in top_5_flags else 'other').dropna().astype(str).unique().tolist())

            self.category_maps['server_monitoring'] = {
                'protocol_type': {value: index for index, value in enumerate(protocol_values)},
                'service': {value: index for index, value in enumerate(service_values)},
                'flag': {value: index for index, value in enumerate(flag_values)},
            }
        except Exception as e:
            print(f"⚠ Failed to build server_monitoring category maps: {str(e)}")
    
    def load_models(self):
        """Load all ML models from pickle files"""
        # Get the backend root directory path correctly
        # __file__ = d:\Tekworks-Project-1\backend\app\models.py
        # parent = d:\Tekworks-Project-1\backend\app
        # parent.parent = d:\Tekworks-Project-1\backend
        # parent.parent.parent = d:\Tekworks-Project-1
        base_path = Path(__file__).parent.parent
        
        for task_key, config in TASKS_CONFIG.items():
            try:
                model_path = base_path / config['model_path']
                if model_path.exists():
                    with open(model_path, 'rb') as f:
                        self.models[task_key] = pickle.load(f)
                    print(f"✓ Loaded {task_key} model")
                else:
                    print(f"⚠ Model file not found: {model_path}")
            except Exception as e:
                print(f"✗ Error loading {task_key}: {str(e)}")
            
            # Load scaler if it exists (for task 4 - health_monitoring)
            if 'scaler_path' in config:
                try:
                    scaler_path = base_path / config['scaler_path']
                    if scaler_path.exists():
                        with open(scaler_path, 'rb') as f:
                            self.scalers[task_key] = pickle.load(f)
                        print(f"✓ Loaded {task_key} scaler")
                except Exception as e:
                    print(f"⚠ Error loading {task_key} scaler: {str(e)}")
            # Load encoder if provided
            if 'encoder_path' in config:
                try:
                    encoder_path = base_path / config['encoder_path']
                    if encoder_path.exists():
                        with open(encoder_path, 'rb') as f:
                            self.encoders[task_key] = pickle.load(f)
                        print(f"✓ Loaded {task_key} encoder")
                except Exception as e:
                    print(f"⚠ Error loading {task_key} encoder: {str(e)}")

            if task_key == 'server_monitoring' and config.get('dataset_path'):
                dataset_path = base_path / config['dataset_path']
                if dataset_path.exists():
                    self._build_server_monitoring_maps(dataset_path)
    
    def predict(self, task_name, features_dict):
        """
        Make a prediction using the specified model
        
        Args:
            task_name: Name of the task (predictive_maintenance, server_monitoring, etc.)
            features_dict: Dictionary of feature values (frontend field names)
            
        Returns:
            Dictionary with prediction, confidence, and risk_level
        """
        if task_name not in self.models:
            raise ValueError(f"Model {task_name} not found")
        
        if task_name not in TASKS_CONFIG:
            raise ValueError(f"Task configuration {task_name} not found")
        
        model = self.models[task_name]
        config = TASKS_CONFIG[task_name]
        
        try:
            # Map frontend field names to model feature names
            frontend_mapping = config.get('frontend_mapping', {})
            type_mapping = config.get('type_mapping', {})
            server_maps = self.category_maps.get(task_name, {})
            
            # Prepare features in the correct order
            feature_list = []
            for feature_name in config['features']:
                # Resolve value from features_dict using several strategies:
                # 1) Exact model feature name (route provided model keys)
                # 2) Mapped frontend name from TASKS_CONFIG
                # 3) Mapped frontend name with common suffixes (e.g. _k, _rpm, _nm)
                value = None

                # 1) Direct model feature key
                if feature_name in features_dict:
                    value = features_dict[feature_name]
                else:
                    # 2) Find mapping entry where model_name == feature_name
                    frontend_field = None
                    for fe_name, model_name in frontend_mapping.items():
                        if model_name == feature_name:
                            frontend_field = fe_name
                            break

                    # 2a) Exact frontend key
                    if frontend_field and frontend_field in features_dict:
                        value = features_dict[frontend_field]
                    # 2b) Try common suffixed variants (backend forms sometimes use _k/_rpm/_nm)
                    elif frontend_field:
                        for k in features_dict.keys():
                            if k.startswith(frontend_field):
                                value = features_dict[k]
                                break

                # If still not found, raise clear error
                if value is None:
                    raise ValueError(f"Missing feature value for model feature: {feature_name}")

                # Handle type mapping for categorical variables (map values like 'L','M','H' -> ints)
                if isinstance(value, str) and value in type_mapping:
                    value = type_mapping[value]

                if task_name == 'server_monitoring' and feature_name in server_maps and isinstance(value, str):
                    mapping = server_maps.get(feature_name, {})
                    if feature_name in ('service', 'flag') and value not in mapping:
                        value = mapping.get('other', 0)
                    else:
                        value = mapping.get(value, 0)

                # If value is categorical string and an encoder exists for this task, try to transform
                if isinstance(value, str) and task_name in self.encoders:
                    enc = self.encoders[task_name]
                    try:
                        # sklearn LabelEncoder or similar expects 1D array
                        transformed = enc.transform([value])
                        # take first element
                        try:
                            value = transformed[0]
                        except Exception:
                            value = float(transformed)
                    except Exception:
                        # encoder might be a dict mapping
                        if isinstance(enc, dict):
                            value = enc.get(value, value)

                # If categorical encoding didn't convert to numeric, map unknowns to -1
                if isinstance(value, str):
                    try:
                        # try casting string numbers
                        value = float(value)
                    except Exception:
                        # unknown categorical value -> use sentinel
                        value = -1.0

                feature_list.append(float(value))
            
            feature_array = np.array([feature_list])
            
            # Apply scaler if it exists (for task 4)
            if task_name in self.scalers:
                feature_array = self.scalers[task_name].transform(feature_array)
            
            # Make prediction
            prediction = model.predict(feature_array)[0]
            
            # Get prediction probability if available
            if hasattr(model, 'predict_proba'):
                probabilities = model.predict_proba(feature_array)[0]
                confidence = max(probabilities) * 100
            else:
                confidence = 85.5  # Default confidence
            
            # Determine risk level
            risk_level = self._get_risk_level(int(prediction), confidence)
            
            # Get prediction text
            prediction_text = self._get_prediction_text(task_name, int(prediction))

            # Include model_info from TASKS_CONFIG description when available
            model_info = config.get('description', '')
            
            return {
                'prediction': int(prediction),
                'prediction_text': prediction_text,
                'confidence': round(confidence, 2),
                'risk_level': risk_level,
                'model_info': model_info
            }
        except Exception as e:
            raise ValueError(f"Prediction error for {task_name}: {str(e)}")
    
    def _get_risk_level(self, prediction, confidence):
        """Determine risk level based on prediction and confidence"""
        # Return plain normalized risk categories to avoid encoding issues
        if prediction == 0:
            return "Low"
        elif confidence < 70:
            return "Medium"
        else:
            return "High"
    
    def _get_prediction_text(self, task_name, prediction):
        """Get human-readable prediction text"""
        prediction_messages = {
            'predictive_maintenance': {
                0: "Equipment operating normally",
                1: "Machine failure detected - Immediate maintenance required"
            },
            'server_monitoring': {
                0: "Server performance normal",
                1: "Downtime risk detected - Check system health"
            },
            'student_risk': {
                0: "Student on track to graduate",
                1: "Dropout risk detected - Intervention needed"
            },
            'health_monitoring': {
                0: "Patient health status normal",
                1: "Health risk detected - Medical attention recommended"
            },
            'supply_chain': {
                0: "Supply chain stable",
                1: "Disruption risk detected - Review logistics"
            },
            'quality_assurance': {
                0: "Product quality acceptable",
                1: "Quality issue detected - Increase inspection"
            }
        }
        
        if task_name in prediction_messages:
            return prediction_messages[task_name].get(prediction, "Prediction made")
        return "Prediction made"


# Global model manager instance
model_manager = ModelManager()
