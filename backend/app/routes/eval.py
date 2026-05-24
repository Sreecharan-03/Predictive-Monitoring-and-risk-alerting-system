from fastapi import APIRouter, HTTPException
import os
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import cross_validate, StratifiedKFold, KFold

from app.config import TASKS_CONFIG

router = APIRouter(tags=["Model Evaluation"])


def find_dataset_for_task(task_key):
    base = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(__file__)), '..', task_key))
    candidates = [
        os.path.join(base, 'Train_data.csv'),
        os.path.join(base, 'train.csv'),
        os.path.join(base, 'data.csv'),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return None


@router.get('/eval/{task_key}')
async def eval_task(task_key: str):
    cfg = TASKS_CONFIG.get(task_key)
    if not cfg:
        raise HTTPException(status_code=404, detail='task not found')

    # resolve model path
    model_path = cfg.get('model_path')
    if not model_path:
        raise HTTPException(status_code=400, detail='no model_path in config')
    model_file = os.path.normpath(os.path.join(os.path.dirname(os.path.dirname(__file__)), model_path))
    if not os.path.exists(model_file):
        raise HTTPException(status_code=404, detail=f'model file not found: {model_file}')

    data_file = find_dataset_for_task(task_key)
    if not data_file:
        raise HTTPException(status_code=404, detail='no dataset found for task')

    try:
        df = pd.read_csv(data_file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'failed reading dataset: {e}')

    # infer target
    target_col = None
    for name in ['class','Class','label','Label','target','Target','anomaly']:
        if name in df.columns:
            target_col = name
            break
    if target_col is None:
        target_col = df.columns[-1]

    df = df.dropna(subset=[target_col])
    y = df[target_col]

    X = df.select_dtypes(include=[np.number]).fillna(0)
    if X.shape[1] == 0:
        raise HTTPException(status_code=400, detail='no numeric features found in dataset')

    try:
        model = joblib.load(model_file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'failed loading model: {e}')

    is_classification = y.dropna().nunique() <= 20 and y.dtype != float
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42) if is_classification else KFold(n_splits=5, shuffle=True, random_state=42)
    scoring = 'accuracy' if is_classification else 'r2'

    try:
        res = cross_validate(model, X, y, cv=cv, scoring=scoring, return_train_score=True, n_jobs=1)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'cross_validate failed: {e}')

    train_mean = float(np.mean(res['train_score']))
    test_mean = float(np.mean(res['test_score']))
    delta = train_mean - test_mean

    return {
        'task': task_key,
        'dataset': data_file,
        'target': target_col,
        'is_classification': bool(is_classification),
        'train_score_mean': train_mean,
        'test_score_mean': test_mean,
        'train_test_gap': delta,
        'overfitting': delta > 0.05
    }
