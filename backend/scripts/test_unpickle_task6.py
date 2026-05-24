from pathlib import Path
import pickle
p = Path(r"d:\Tekworks-Project-1\task-6\model.pkl")
print('Model path exists:', p.exists())
try:
    with open(p,'rb') as f:
        obj = pickle.load(f)
    print('Unpickled type:', type(obj))
except Exception as e:
    import traceback
    traceback.print_exc()
    print('ERROR:', e)
