import os
import argparse
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import cross_validate, StratifiedKFold, KFold

def evaluate(model_file, data_file, target_col=None):
    df = pd.read_csv(data_file)
    if target_col is None:
        # try common names
        for name in ['class','Class','label','Label','target','Target','class_label','classLabel','anomaly']:
            if name in df.columns:
                target_col = name
                break
    if target_col is None:
        target_col = df.columns[-1]

    df = df.dropna(subset=[target_col])
    y = df[target_col]

    X = df.select_dtypes(include=[np.number]).fillna(0)
    if X.shape[1] == 0:
        raise RuntimeError('no numeric features found')

    model = joblib.load(model_file)

    is_classification = y.dropna().nunique() <= 20 and y.dtype != float
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42) if is_classification else KFold(n_splits=5, shuffle=True, random_state=42)
    scoring = 'accuracy' if is_classification else 'r2'

    res = cross_validate(model, X, y, cv=cv, scoring=scoring, return_train_score=True, n_jobs=1)
    train_mean = float(np.mean(res['train_score']))
    test_mean = float(np.mean(res['test_score']))
    delta = train_mean - test_mean

    out = {
        'model_file': model_file,
        'data_file': data_file,
        'target_col': target_col,
        'is_classification': bool(is_classification),
        'train_score_mean': train_mean,
        'test_score_mean': test_mean,
        'train_test_gap': delta,
        'overfitting': delta > 0.05
    }
    print(json.dumps(out, indent=2))


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--model', required=False, help='path to model file')
    p.add_argument('--data', required=False, help='path to dataset CSV')
    p.add_argument('--task', required=False, help='task key (server_monitoring)')
    args = p.parse_args()

    if args.task == 'server_monitoring' and not args.model and not args.data:
        base = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', '..'))
        model = os.path.join(base, 'task-2', 'model.pkl')
        data = os.path.join(base, 'task-2', 'Train_data.csv')
        evaluate(model, data)
        return

    if not args.model or not args.data:
        raise SystemExit('Provide --model and --data or --task server_monitoring')

    evaluate(args.model, args.data)


if __name__ == '__main__':
    main()
