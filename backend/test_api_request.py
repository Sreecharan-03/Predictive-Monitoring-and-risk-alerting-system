import json, urllib.request, urllib.error
url='http://localhost:8001/api/predict/quality-monitor/predict'
data=json.dumps({"production_volume":1000,"production_cost":5000,"supplier_quality":0.9,"quality_score":85,"maintenance_hours":10,"downtime_percentage":2.5,"worker_productivity":75}).encode('utf-8')
req=urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print('STATUS', resp.status)
        print(resp.read().decode())
except urllib.error.HTTPError as e:
    print('HTTP ERROR', e.code)
    print(e.read().decode())
except Exception as e:
    print('ERR', e)
