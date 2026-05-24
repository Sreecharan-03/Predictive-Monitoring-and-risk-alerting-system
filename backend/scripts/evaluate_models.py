import os
import json
import pandas as pd
import numpy as np
from sklearn.model_selection import cross_validate, StratifiedKFold, KFold
from sklearn.metrics import accuracy_score, r2_score
import joblib

from app.config import TASKS_CONFIG


def load_dataset(task_key, cfg):
    # try common file names in task folder
    base = os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', task_key)
    base = os.path.normpath(base)
    candidates = [
        os.path.join(base, 'ai4i_predictive_maintenance.csv'),
        os.path.join(base, 'ai4i2020.csv'),
        os.path.join(base, 'Train_data.csv'),
        os.path.join(base, 'student_dropout_dataset_v3.csv'),
        os.path.join(base, 'stroke.csv'),
        os.path.join(base, 'supply_chain_data.csv'),
        os.path.join(base, 'manufacturing_defect_dataset.csv'),
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                df = pd.read_csv(p)
                return df, p
            except Exception:
                continue
    return None, None


def infer_target_column(df):
    # common target names
    for name in ['Machine failure', 'MachineFailure', 'machine_failure', 'class', 'Dropout', 'stroke', 'DefectStatus', 'defect_status']:
        if name in df.columns:
            return name
    # fallback: try last column if binary/numeric
    last = df.columns[-1]
    return last


def evaluate_task(task_key, cfg):
    df, path = load_dataset(task_key, cfg)
    if df is None:
        return {'task': task_key, 'error': 'no dataset found'}

    target_col = infer_target_column(df)
    # drop rows with NaN in target
    df = df.dropna(subset=[target_col])

    # select features from config if present
    features = cfg.get('features') or []
    X = df.copy()
    if features:
        existing = [c for c in features if c in df.columns]
        if existing:
            X = df[existing]
        else:
            # try frontend mapping keys
            fm = cfg.get('frontend_mapping', {})
            mapped = [v for k, v in fm.items() if v in df.columns]
            if mapped:
                X = df[mapped]
    y = df[target_col]

    # simple preprocessing: drop non-numeric columns
    X_num = X.select_dtypes(include=[np.number]).fillna(0)
    if X_num.shape[1] == 0:
        return {'task': task_key, 'error': 'no numeric features found for evaluation', 'dataset': path, 'target': target_col}

    # load model
    model_path = cfg.get('model_path')
    if not model_path:
        return {'task': task_key, 'error': 'no model_path in config'}
    model_file = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(__file__)), model_path))
    if not os.path.exists(model_file):
        return {'task': task_key, 'error': f'model file not found: {model_file}'}
    model = joblib.load(model_file)

    # choose CV strategy
    is_classification = y.dropna().nunique() <= 20 and y.dtype != float
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42) if is_classification else KFold(n_splits=5, shuffle=True, random_state=42)

    scoring = 'accuracy' if is_classification else 'r2'

    try:
        res = cross_validate(model, X_num, y, cv=cv, scoring=scoring, return_train_score=True, n_jobs=1)
    except Exception as e:
        return {'task': task_key, 'error': f'cross_validate failed: {e}'}

    train_mean = float(np.mean(res['train_score']))
    test_mean = float(np.mean(res['test_score']))
    delta = train_mean - test_mean

    return {
        'task': task_key,
        'dataset': path,
        'target': target_col,
        'is_classification': bool(is_classification),
        'train_score_mean': train_mean,
        'test_score_mean': test_mean,
        'train_test_gap': delta,
        'overfitting': delta > 0.05
    }


def main():
    results = []
    for key, cfg in TASKS_CONFIG.items():
        res = evaluate_task(key, cfg)
        results.append(res)

    out = {'results': results}
    print(json.dumps(out, indent=2))


if __name__ == '__main__':
    main()
