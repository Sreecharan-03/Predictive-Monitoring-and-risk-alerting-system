from pathlib import Path
import pickle
p = Path(r"d:\Tekworks-Project-1\task-5\model.pkl")
print('exists', p.exists())
with open(p,'rb') as f:
    m = pickle.load(f)
print('type', type(m))
print('has n_features_in_', hasattr(m, 'n_features_in_'))
if hasattr(m, 'n_features_in_'):
    print('n_features_in_', m.n_features_in_)
print('has feature_names_in_', hasattr(m, 'feature_names_in_'))
if hasattr(m, 'feature_names_in_'):
    print('feature_names_in_', m.feature_names_in_)
