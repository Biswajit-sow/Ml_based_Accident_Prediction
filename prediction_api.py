from flask import Flask, request, jsonify, send_file
import joblib
import pandas as pd
import numpy as np
import re
import os
import sys
from flask_cors import CORS
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from spatial_analysis import HotspotAnalyzer


app = Flask(__name__)
CORS(app)


# Load trained model and metadata
model = joblib.load('C:/Users/rahul/OneDrive/Desktop/ai-traffic-prediction-backend new/ai-traffic-prediction-backend/models/best_model.joblib')
severity_mapping = joblib.load('C:/Users/rahul/OneDrive/Desktop/ai-traffic-prediction-backend new/ai-traffic-prediction-backend/models/severity_mapping.joblib')
feature_names = joblib.load('C:/Users/rahul/OneDrive/Desktop/ai-traffic-prediction-backend new/ai-traffic-prediction-backend/models/feature_names.joblib')

# Load hotspot analyzer
hotspot_analyzer = HotspotAnalyzer(csv_path='C:/Users/rahul/OneDrive/Desktop/ai-traffic-prediction-backend new/ai-traffic-prediction-backend/data/processed/asia_accident_hotspots_enhanced.csv')


def parse_experience_to_years(experience_input):
    """Parse driver experience string to years"""
    try:
        experience_str = str(experience_input).lower().strip()
        number = re.search(r'\d+\.?\d*', experience_str)
        if not number:
            return 5.0
        value = float(number.group())
        if 'month' in experience_str:
            return value / 12
        else:
            return value
    except:
        return 5.0


def format_experience_display(years):
    """Format years to readable experience string"""
    if years < 1:
        months = int(years * 12)
        return f"{months} months"
    else:
        return f"{years:.1f} years"


def calculate_experience_score(years):
    """Calculate risk score based on driver experience (1-5 scale)"""
    if years < 0.5:
        return 5  # Extreme risk
    elif years < 1:
        return 4  # Very high risk
    elif years < 2:
        return 3  # High risk
    elif years < 5:
        return 2  # Medium risk
    else:
        return 1  # Low risk


def calculate_driver_speed_score(speed_habit):
    """Calculate risk score based on driving speed habit (1-5 scale)"""
    try:
        speed = float(speed_habit)
        if speed < 40:
            return 1  # Safe/Cautious
        elif speed < 60:
            return 1  # Moderate
        elif speed < 80:
            return 2  # Slightly risky
        elif speed < 100:
            return 3  # Risky
        else:
            return 4  # Very risky
    except:
        return 2


def calculate_age_risk_score(age):
    """Calculate risk score based on driver age (1-5 scale)"""
    if age < 20:
        return 5  # Very high risk
    elif age < 25:
        return 4  # High risk
    elif age > 70:
        return 4  # High risk (elderly)
    elif age > 60:
        return 3  # Medium risk
    else:
        return 1  # Low risk (25-60)


def calculate_vehicle_condition_score(condition):
    """Calculate risk score based on vehicle condition (1-5 scale)"""
    condition_lower = str(condition).lower()
    if 'poor' in condition_lower or 'bad' in condition_lower or 'terrible' in condition_lower:
        return 5  # Extreme risk
    elif 'average' in condition_lower or 'medium' in condition_lower or 'ok' in condition_lower:
        return 3  # Medium risk
    elif 'good' in condition_lower or 'excellent' in condition_lower:
        return 1  # Low risk
    else:
        return 2  # Default moderate risk


def calculate_weather_risk_score(weather):
    """Calculate risk score based on weather (1-5 scale)"""
    weather_lower = str(weather).lower()
    if 'storm' in weather_lower or 'tornado' in weather_lower or 'hurricane' in weather_lower:
        return 5  # Extreme risk
    elif 'heavy rain' in weather_lower or 'snow' in weather_lower or 'hail' in weather_lower:
        return 4  # Very high risk
    elif 'rain' in weather_lower or 'fog' in weather_lower or 'mist' in weather_lower:
        return 3  # High risk
    elif 'cloudy' in weather_lower or 'drizzle' in weather_lower:
        return 2  # Medium risk
    else:  # Clear, sunny
        return 1  # Low risk


def encode_categorical(value, category_type):
    """Encode categorical features"""
    value_lower = str(value).lower().strip()
    
    if category_type == 'state':
        state_mapping = {
            'maharashtra': 0, 'delhi': 1, 'karnataka': 2, 'tamil nadu': 3,
            'gujarat': 4, 'uttar pradesh': 5, 'punjab': 6, 'west bengal': 7,
            'rajasthan': 8, 'telangana': 9, 'andhra pradesh': 10
        }
        return state_mapping.get(value_lower, 0)
    
    elif category_type == 'city':
        city_mapping = {
            'mumbai': 0, 'delhi': 1, 'bangalore': 2, 'chennai': 3, 'pune': 4,
            'hyderabad': 5, 'kolkata': 6, 'ahmedabad': 7, 'lucknow': 8, 'chandigarh': 9
        }
        return city_mapping.get(value_lower, 0)
    
    elif category_type == 'vehicle':
        vehicle_mapping = {'car': 0, 'bike': 1, 'motorcycle': 1, 'truck': 2, 'auto': 3, 'suv': 0}
        return vehicle_mapping.get(value_lower, 0)
    
    elif category_type == 'lighting':
        if 'dark' in value_lower or 'night' in value_lower:
            return 1
        else:
            return 0
    
    elif category_type == 'traffic':
        traffic_mapping = {'lights': 2, 'signs': 1, 'police': 2, 'none': 0}
        return traffic_mapping.get(value_lower, 0)
    
    return 0


@app.route('/')
def home():
    """API Home - Show available endpoints and features"""
    return jsonify({
        'message': 'AI Traffic Accident Severity Prediction API v4.0',
        'version': '4.0',
        'status': 'Running ✅',
        'description': 'Real-world accident risk prediction with clean features',
        'endpoints': {
            'GET /': 'API info and documentation',
            'POST /predict': 'Predict accident severity with ML + hotspot analysis',
            'POST /hotspot_analysis': 'Get distance-based hotspot risk assessment',
            'POST /generate_hotspot_map': 'Generate interactive Asia hotspot map',
            'GET /hotspot_map': 'View generated interactive map'
        },
        'key_features': {
            'ml_prediction': 'RandomForest/XGBoost based severity classification',
            'distance_based_risk': 'Risk zones based on proximity to accident hotspots',
            'travel_permission': 'System indicates if travel is ALLOWED or NOT ALLOWED',
            'combined_recommendation': 'Integrated ML + hotspot recommendation',
            'realistic_accuracy': '45-50% (real-world data, not artificial)',
            'asia_coverage': '25+ major accident-prone zones in Asia'
        },
        'severity_levels': {
            '0': 'Minor - Low injury accidents',
            '1': 'Serious - Moderate to serious injuries',
            '2': 'Fatal - Fatal accidents'
        },
        'distance_based_risk_zones': {
            '0-10 km': '🔴🔴🔴 HIGH CRITICAL RED ZONE - DO NOT TRAVEL',
            '10-50 km': '🔴🔴 CRITICAL ZONE - EXTREME CAUTION REQUIRED',
            '50-150 km': '🟡 MEDIUM RISK ZONE - ELEVATED ALERTNESS',
            '150-300 km': '🟢 LOW RISK ZONE - NORMAL PRECAUTIONS',
            '300+ km': '✅ NO RISK - SAFE TO TRAVEL'
        }
    }), 200


@app.route('/hotspot_analysis', methods=['POST'])
def hotspot_analysis():
    """
    Analyze accident hotspots with distance-based risk classification
    Required: latitude, longitude
    Optional: radius_km (default 500)
    """
    try:
        data = request.get_json()
        
        user_lat = float(data.get('latitude'))
        user_lon = float(data.get('longitude'))
        radius_km = float(data.get('radius_km', 500))
        
        # Get hotspot analysis
        analysis = hotspot_analyzer.get_hotspot_analysis(user_lat, user_lon, radius_km)
        
        return jsonify({
            'status': 'success',
            'location': {
                'latitude': user_lat,
                'longitude': user_lon,
                'coordinates_type': 'GPS (WGS84)'
            },
            'search_radius_km': radius_km,
            'hotspot_analysis': analysis,
            'timestamp': pd.Timestamp.now().isoformat()
        }), 200
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Hotspot analysis failed',
            'required_fields': ['latitude (float)', 'longitude (float)'],
            'optional_fields': ['radius_km (float, default: 500)']
        }), 400


@app.route('/generate_hotspot_map', methods=['POST'])
def generate_hotspot_map():
    """Generate interactive Asia hotspot map with distance-based risk zones"""
    try:
        data = request.get_json()
        
        user_lat = float(data.get('latitude'))
        user_lon = float(data.get('longitude'))
        radius_km = float(data.get('radius_km', 500))
        
        # Generate map
        output_dir = 'C:/Users/rahul/OneDrive/Desktop/ai-traffic-prediction-backend new/ai-traffic-prediction-backend/outputs'
        os.makedirs(output_dir, exist_ok=True)
        map_filename = f'{output_dir}/asia_hotspots_map.html'
        
        hotspot_analyzer.generate_asia_hotspot_map(
            user_lat=user_lat,
            user_lon=user_lon,
            radius_km=radius_km,
            filename=map_filename
        )
        
        return jsonify({
            'status': 'success',
            'message': 'Interactive hotspot map generated successfully',
            
            'map_file': map_filename,
            'view_url': 'http://127.0.0.1:5000/hotspot_map',
            'location': {
                'latitude': user_lat,
                'longitude': user_lon,
                'search_radius_km': radius_km
            },
            'map_features': {
                'zones': 'Color-coded by distance-based risk',
                'markers': 'Interactive hotspot locations',
                'legend': 'Risk classification guide'
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'message': 'Map generation failed',
            'required_fields': ['latitude (float)', 'longitude (float)']
        }), 400


@app.route('/hotspot_map')
def view_hotspot_map():
    """Serve the generated interactive hotspot map"""
    try:
        map_file = 'C:/Users/rahul/OneDrive/Desktop/ai-traffic-prediction-backend new/ai-traffic-prediction-backend/outputs/asia_hotspots_map.html'
        if os.path.exists(map_file):
            response = send_file(map_file)
            response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
            return response
        else:
            return jsonify({
                'error': 'Map not found',
                'message': 'Please generate the map first using POST /generate_hotspot_map',
                'steps': [
                    '1. Call POST /generate_hotspot_map with latitude and longitude',
                    '2. Wait for map generation',
                    '3. Visit GET /hotspot_map to view'
                ]
            }), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict', methods=['POST'])
def predict():
    """
    UPDATED v4.0: Predict accident severity with clean features
    Removed: Speed Limit, Vehicles Involved, Casualties, Fatalities (outcome variables)
    
    Returns ML prediction + distance-based hotspot risk + combined recommendation
    """
    try:
        data = request.get_json()
        
        # Extract coordinates for hotspot analysis
        user_lat = data.get('latitude')
        user_lon = data.get('longitude')
        
        hotspot_info = None
        travel_permission = None
        hotspot_risk_level = None
        
        if user_lat and user_lon:
            try:
                user_lat = float(user_lat)
                user_lon = float(user_lon)
                hotspot_info = hotspot_analyzer.get_hotspot_analysis(user_lat, user_lon, radius_km=500)
                travel_permission = hotspot_info.get('travel_permission', 'Unknown')
                hotspot_risk_level = hotspot_info.get('overall_risk_level', 'Unknown')
            except Exception as e:
                print(f"Hotspot analysis warning: {str(e)}")
                hotspot_info = None
        
        # Extract time features
        dt = pd.to_datetime(data.get('datetime', '2023-01-01 12:00'))
        hour = dt.hour
        is_rush_hour = 1 if hour in [7, 8, 9, 17, 18, 19] else 0
        is_weekend = 1 if dt.weekday() >= 5 else 0
        
        # Driver experience scoring
        driver_experience_years = parse_experience_to_years(data.get('driver_experience', '5 years'))
        experience_score = calculate_experience_score(driver_experience_years)
        
        # Vehicle condition scoring
        vehicle_condition_score = calculate_vehicle_condition_score(data.get('vehicle_condition', 'good'))
        
        # Driver speed habit scoring
        driver_speed_habit = float(data.get('driver_speed_habit', 80))
        driver_speed_score = calculate_driver_speed_score(driver_speed_habit)
        
        # Age risk scoring
        age = int(data.get('Driver Age', 30))
        age_score = calculate_age_risk_score(age)
        
        # Weather scoring
        weather_score = calculate_weather_risk_score(data.get('Weather Conditions', 'Clear'))
        
        # Road type scoring
        road_type = str(data.get('Road Type', 'Urban Road')).lower()
        road_type_score = 4 if 'national' in road_type else 3 if 'state' in road_type else 2 if 'urban' in road_type else 1
        
        # Road condition scoring
        road_cond = str(data.get('Road Condition', 'Dry')).lower()
        road_cond_score = 5 if 'construction' in road_cond else 4 if 'damaged' in road_cond else 3 if 'wet' in road_cond else 1
        
        # License scoring
        license_status = str(data.get('Driver License Status', 'Valid')).lower()
        license_score = 5 if 'expired' in license_status else 4 if 'no' in license_status else 1
        
        # Alcohol flag
        alcohol_flag = int(data.get('alcohol_flag', 0))
        
        # Encode categorical features
        state_enc = encode_categorical(data.get('State Name', 'Unknown'), 'state')
        city_enc = encode_categorical(data.get('City Name', 'Unknown'), 'city')
        vehicle_type_enc = encode_categorical(data.get('Vehicle Type Involved', 'Car'), 'vehicle')
        lighting_enc = encode_categorical(data.get('Lighting Conditions', 'Bright'), 'lighting')
        traffic_enc = encode_categorical(data.get('Traffic Control Presence', 'Signs'), 'traffic')
        
        # Build feature vector with CLEAN features (no outcome variables)
        feature_values = {
            'hour': hour,
            'is_weekend': is_weekend,
            'is_rush_hour': is_rush_hour,
            'weather_score': weather_score,
            'road_type_score': road_type_score,
            'road_cond_score': road_cond_score,
            'age_score': age_score,
            'license_score': license_score,
            'alcohol_flag': alcohol_flag,
            'experience_score': experience_score,
            'vehicle_condition_score': vehicle_condition_score,
            'driver_speed_score': driver_speed_score,
            'State Name_enc': state_enc,
            'City Name_enc': city_enc,
            'Vehicle Type Involved_enc': vehicle_type_enc,
            'Lighting Conditions_enc': lighting_enc,
            'Traffic Control Presence_enc': traffic_enc
        }
        
        # Create DataFrame and predict
        X = pd.DataFrame([feature_values])
        X = X[feature_names]
        
        # Get ML prediction
        prediction = int(model.predict(X)[0])
        probability = float(model.predict_proba(X)[0][prediction])
        
        severity_label = severity_mapping.get(prediction, 'Unknown')
        
        ml_risk_levels = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}
        ml_risk_level = ml_risk_levels.get(prediction, 'UNKNOWN')
        
        recommendations = {
            0: '✅ Safe to travel - normal conditions',
            1: '⚠️ Drive carefully and stay alert',
            2: '🔴 High risk - consider alternative route or postpone'
        }
        recommendation = recommendations.get(prediction, 'Unknown')
        
        # Combine ML prediction with hotspot analysis
        combined_recommendation = recommendation
        if hotspot_info:
            if 'HIGH CRITICAL RED ZONE' in hotspot_risk_level:
                combined_recommendation = f"⛔ CRITICAL HOTSPOT: {travel_permission}"
            elif 'CRITICAL' in hotspot_risk_level:
                combined_recommendation = f"⚠️ ALERT - Danger zone nearby: {travel_permission}"
            elif 'MEDIUM' in hotspot_risk_level:
                combined_recommendation = f"⚠️ CAUTION - {travel_permission}"
            else:
                combined_recommendation = f"✅ Location safe - {travel_permission}"
        
        response = {
            'prediction_summary': {
                'severity': severity_label,
                'severity_code': prediction,
                'ml_probability': round(probability, 4),
                'ml_risk_level': ml_risk_level,
                'timestamp': pd.Timestamp.now().isoformat()
            },
            
            'input_summary': {
                'time': data.get('datetime'),
                'location': f"{data.get('City Name', 'Unknown')}, {data.get('State Name', 'Unknown')}",
                'coordinates': f"({user_lat}, {user_lon})" if user_lat and user_lon else 'N/A',
                'weather': data.get('Weather Conditions'),
                'road_condition': data.get('Road Condition'),
                'vehicle_type': data.get('Vehicle Type Involved'),
                'driver_experience': format_experience_display(driver_experience_years),
                'driver_speed_habit': f"{driver_speed_habit} km/h",
                'driver_age': age
            },
            
            'feature_scores': {
                'experience_score': experience_score,
                'driver_speed_score': driver_speed_score,
                'vehicle_condition_score': vehicle_condition_score,
                'age_score': age_score,
                'weather_score': weather_score,
                'road_type_score': road_type_score,
                'road_condition_score': road_cond_score,
                'license_score': license_score,
                'lighting_conditions': lighting_enc,
                'traffic_control': traffic_enc,
                'alcohol_involved': alcohol_flag == 1
            },
            
            'combined_risk': {
                'ml_recommendation': recommendation,
                'combined_recommendation': combined_recommendation,
                'travel_safe': 'YES' if ml_risk_level == 'LOW' and (not hotspot_info or 'NO RISK' in hotspot_risk_level) else 'NO'
            }
        }
        
        # Add hotspot analysis if available
        if hotspot_info:
            response['hotspot_analysis'] = {
                'overall_risk_level': hotspot_risk_level,
                'travel_permission': travel_permission,
                'closest_danger': hotspot_info.get('closest_danger'),
                'distance_km': hotspot_info.get('closest_distance_km'),
                'total_hotspots_nearby': hotspot_info.get('total_nearby', 0),
                'nearby_hotspots': hotspot_info.get('nearby_hotspots', [])[:5]
            }
            
            response['map_generation'] = {
                'available': True,
                'endpoint': 'POST /generate_hotspot_map',
                'description': 'Generate interactive map showing hotspots and risk zones'
            }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Prediction failed',
            'required_input_fields': [
                'datetime (format: YYYY-MM-DD HH:MM)',
                'State Name (string)',
                'City Name (string)',
                'Driver Age (integer)',
                'Driver License Status (Valid/Expired/No License)',
                'driver_experience (string: e.g., "5 years", "6 months")',
                'driver_speed_habit (integer: km/h)',
                'alcohol_flag (0 or 1)',
                'Vehicle Type Involved (Car/Bike/Truck/Auto)',
                'vehicle_condition (good/average/poor)',
                'Road Type (Urban Road/State Highway/National Highway)',
                'Road Condition (Dry/Wet/Damaged)',
                'Weather Conditions (Clear/Rainy/Foggy/Stormy)',
                'Lighting Conditions (Bright/Dusk/Dark)',
                'Traffic Control Presence (Lights/Signs/Police/None)'
            ],
            'optional_input_fields': [
                'latitude (float) - for hotspot analysis',
                'longitude (float) - for hotspot analysis',
                'radius_km (float) - hotspot search radius'
            ]
        }), 400


if __name__ == '__main__':
    print("\n" + "="*80)
    print("🚗 AI TRAFFIC ACCIDENT SEVERITY PREDICTION API v4.0")
    print("="*80)
    print("📍 Server: http://127.0.0.1:5000")
    print("📖 API Info: GET http://127.0.0.1:5000/")
    print("🔮 Predict: POST http://127.0.0.1:5000/predict")
    print("🗺️  Hotspot Analysis: POST http://127.0.0.1:5000/hotspot_analysis")
    print("🌏 Generate Map: POST http://127.0.0.1:5000/generate_hotspot_map")
    print("👁️  View Map: GET http://127.0.0.1:5000/hotspot_map")
    print("="*80)
    
    print("\n🆕 VERSION 4.0 IMPROVEMENTS:")
    print("   ✅ REMOVED: Speed Limit (km/h) - outcome variable")
    print("   ✅ REMOVED: Number of Vehicles Involved - outcome variable")
    print("   ✅ REMOVED: Number of Casualties - outcome variable")
    print("   ✅ REMOVED: Number of Fatalities - outcome variable")
    print("   ✅ ADDED: Realistic feature scoring (1-5 scales)")
    print("   ✅ KEPT: Distance-based hotspot risk classification")
    print("   ✅ KEPT: Travel permission system")
    print("   ✅ KEPT: Interactive map generation")
    print("   ✅ KEPT: Combined ML + hotspot recommendations")
    
    print("\n📊 SEVERITY LEVELS (ML-Based):")
    print("   0 = Minor  → LOW RISK 🟢")
    print("   1 = Serious → MEDIUM RISK 🟡")
    print("   2 = Fatal  → HIGH RISK 🔴")
    
    print("\n📍 DISTANCE-BASED RISK ZONES:")
    print("   0-10 km    → 🔴🔴🔴 HIGH CRITICAL RED ZONE")
    print("   10-50 km   → 🔴🔴 CRITICAL ZONE")
    print("   50-150 km  → 🟡 MEDIUM RISK ZONE")
    print("   150-300 km → 🟢 LOW RISK ZONE")
    print("   300+ km    → ✅ NO RISK - SAFE TO TRAVEL")
    
    print("\n⭐ EXPERIENCE SCORING (1-5):")
    print("   5 = < 6 months → EXTREME RISK")
    print("   4 = 6-12 months → VERY HIGH RISK")
    print("   3 = 1-2 years → HIGH RISK")
    print("   2 = 2-5 years → MEDIUM RISK")
    print("   1 = 5+ years → LOW RISK")
    
    print("\n⚡ KEY FEATURES:")
    print("   • Real-world accident prediction (45-50% accuracy)")
    print("   • Clean features (no data leakage)")
    print("   • Distance-based hotspot analysis")
    print("   • Interactive map visualization")
    print("   • Comprehensive risk scoring")
    print("   • Combined safety recommendations")
    
    print("\n✨ System Ready for Production! ✨\n")
    print("="*80 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
