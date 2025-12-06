import requests

data = {
    "datetime": "2025-10-24 18:00",
    "State Name": "Maharashtra",
    "City Name": "Mumbai",
    "latitude": 19.0760,
    "longitude": 72.8777,
    
    
    "Road Type": "National Highway",
    "Road Condition": "Dry",
    "Lighting Conditions": "Dark",
    "Traffic Control Presence": "Signs",
    "Vehicle Type Involved": "Car",
    "vehicle_condition": "poor",
    "Weather Conditions": "Clear",
    "Driver Age": 30,
    "Driver License Status": "Valid",
    "driver_experience": "6 months",
    "driver_speed_habit": 70,
    "Speed Limit (km/h)": 80,
    "Number of Vehicles Involved": 1,
    "Number of Casualties": 0,
    "Number of Fatalities": 0,
    "alcohol_flag": 1,
    "State Name_enc": 0,
    "City Name_enc": 0,
    "Vehicle Type Involved_enc": 0,
    "Lighting Conditions_enc": 0,
    "Traffic Control Presence_enc": 0
}

print("\n" + "="*80)
print("🧪 TESTING API")
print("="*80)

response = requests.post('http://127.0.0.1:5000/predict', json=data)

print(f"Status Code: {response.status_code}\n")

if response.status_code == 200:
    result = response.json()
    
    print("✅ Prediction successful!")
    print(f"Severity: {result['severity']}")
    print(f"Risk Level: {result['risk_level']}")
    print(f"Probability: {result['probability']}")
    print(f"Recommendation: {result['recommendation']}")
    
    print(f"\n📍 Input Summary:")
    for key, val in result['input_summary'].items():
        print(f"   {key}: {val}")
    
    print(f"\n🎯 Feature Scores:")
    for key, val in result['feature_scores'].items():
        print(f"   {key}: {val}")
else:
    result = response.json()
    print("❌ Error!")
    print(result)

print("\n" + "="*80 + "\n")
