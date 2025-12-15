# AI Traffic Accident Severity Prediction System

## 📋 Project Overview

**AI Traffic Accident Severity Prediction** is an intelligent system designed to predict the **severity level** of traffic accidents in real-time based on multiple environmental, vehicular, and driver-related factors. The system leverages machine learning algorithms to assess accident risk and provide actionable safety recommendations.

### 🎯 Objective

Develop a production-ready ML-powered application that:
- Predicts accident severity (Minor, Serious, Fatal)
- Analyzes distance-based hotspot risk zones
- Provides real-time travel recommendations
- Integrates spatial analysis for accident-prone locations across Asia

***

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              AI Traffic Accident Prediction                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend (React.js)          Backend (Flask)                │
│  ├─ PredictionForm            ├─ ML Model (joblib)           │
│  ├─ ResultPage                ├─ Feature Encoding            │
│  └─ ResultCard                ├─ Hotspot Analysis            │
│                                └─ Risk Scoring (1-5 scale)   │
│                                                               │
│  Database: CSV-based Hotspot Data (Asia)                     │
│  Model: RandomForest / XGBoost Classification                │
└─────────────────────────────────────────────────────────────┘
```

***

## 💾 Dataset & Preprocessing

### **Data Source**
- Real-world traffic accident records from India
- ~10,000 accident records with 25+ attributes
- Geospatial data for 25+ accident hotspots across Asia

### **Key Features**
| Category | Features |
|----------|----------|
| **Temporal** | Hour, Day of Week, Rush Hour Flag, Weekend Flag |
| **Environmental** | Weather, Road Type, Road Condition |
| **Vehicle** | Vehicle Type, Vehicle Condition |
| **Driver** | Age, License Status, Experience (years), Speed Habit |
| **Safety** | Lighting Conditions, Traffic Control, Alcohol Involvement |

### **Data Preprocessing Steps**
1. **Cleaning:** Removed duplicates, handled missing values
2. **Feature Engineering:** Created risk scores (1-5 scale) for subjective features
3. **Encoding:** Categorical variables mapped to numerical codes
4. **Validation:** Removed outcome variables (Speed Limit, Casualties, Fatalities) to prevent data leakage

**Output:** Severity Classification
- **0 = Minor** → Low injury accidents
- **1 = Serious** → Moderate to serious injuries
- **2 = Fatal** → Fatal accidents

***

## 🧪 Experiments & Model Training

### **Feature Scoring System**

#### Experience Score (1-5 Scale)
- **5:** < 6 months → Extreme Risk
- **4:** 6-12 months → Very High Risk
- **3:** 1-2 years → High Risk
- **2:** 2-5 years → Medium Risk
- **1:** 5+ years → Low Risk

#### Weather Risk Score (1-5 Scale)
- **5:** Storm, Tornado, Hurricane → Extreme Risk
- **4:** Heavy Rain, Snow, Hail → Very High Risk
- **3:** Rain, Fog, Mist → High Risk
- **2:** Cloudy, Drizzle → Medium Risk
- **1:** Clear, Sunny → Low Risk

#### Driver Age Risk Score (1-5 Scale)
- **5:** < 20 years → Very High Risk
- **4:** 20-25 or > 70 → High Risk
- **3:** 60-70 → Medium Risk
- **1:** 25-60 → Low Risk

#### Speed Habit Score (1-5 Scale)
- **1:** < 60 km/h → Safe/Moderate
- **2:** 60-80 km/h → Slightly Risky
- **3:** 80-100 km/h → Risky
- **4:** > 100 km/h → Very Risky

#### Vehicle Condition Score (1-5 Scale)
- **5:** Poor/Bad/Terrible → Extreme Risk
- **3:** Average/Medium/OK → Medium Risk
- **1:** Good/Excellent → Low Risk

### **Model Selection & Comparison**

| Model | Type | Advantages |
|-------|------|-----------|
| **RandomForest** | Ensemble | Fast inference, handles non-linear patterns |
| **XGBoost** | Gradient Boosting | Superior performance on imbalanced data |
| **Logistic Regression** | Linear | Baseline for comparison |

**Selected Model:** RandomForest/XGBoost (Best performance on validation set)

### **Hyperparameter Tuning**
- GridSearchCV for parameter optimization
- Cross-validation (5-fold) for robust evaluation
- Class weight balancing for imbalanced dataset

***

## 🔧 Technical Stack

### **Backend**
- **Framework:** Flask (Python)
- **ML Libraries:** scikit-learn, XGBoost, joblib
- **Data Processing:** pandas, NumPy
- **Geospatial:** Distance-based hotspot analysis
- **API:** RESTful with CORS support

### **Frontend**
- **Framework:** React.js
- **Styling:** Bootstrap 5 + Custom CSS
- **State Management:** React Hooks (useState)
- **Routing:** React Router v6
- **HTTP Client:** Axios

### **Deployment**
- **Backend:** Flask development server (Production-ready with gunicorn)
- **Frontend:** Node.js + npm
- **Database:** CSV-based (Scalable to PostgreSQL)

***

## 📊 Key Features

### **1. ML-Based Severity Prediction**
- Real-time accident risk classification
- Probability scoring (0-100%)
- Risk level mapping (Low/Medium/High)

### **2. Distance-Based Hotspot Analysis**
- Proximity-based risk assessment
- 5-zone classification system:
  - **0-10 km:** 🔴🔴🔴 High Critical Red Zone
  - **10-50 km:** 🔴🔴 Critical Zone
  - **50-150 km:** 🟡 Medium Risk Zone
  - **150-300 km:** 🟢 Low Risk Zone
  - **300+ km:** ✅ No Risk

### **3. Combined Recommendations**
- ML prediction + Hotspot risk integration
- Travel permission system (ALLOWED/NOT ALLOWED)
- Real-time safety alerts

### **4. Interactive Hotspot Map**
- Geospatial visualization of accident zones
- Dynamic map generation with Folium
- Risk zone color-coding

***

## 🚀 API Endpoints

### **Prediction Endpoint**
```
POST /predict
```
**Input:** Accident parameters (time, location, weather, driver info, etc.)  
**Output:** Severity prediction + probability + hotspot analysis

### **Hotspot Analysis**
```
POST /hotspot_analysis
```
**Input:** Latitude, Longitude, Radius (km)  
**Output:** Distance-based risk classification + nearby hotspots

### **Map Generation**
```
POST /generate_hotspot_map
```
**Output:** Interactive HTML map with accident zones

***

## 📈 Model Evaluation Metrics

- **Precision:** Class-wise precision for each severity level
- **Recall:** Sensitivity for identifying high-risk scenarios
- **F1-Score:** Balanced performance metric
- **ROC-AUC:** Classification performance across thresholds
- **Confusion Matrix:** True/False positives and negatives

***

## 🔐 Data Quality & NaN Prevention

### **Robust Probability Handling**
- Safe extraction from predict_proba() output
- NaN detection and fallback to 0.0
- Validation of array shape before indexing

### **Frontend Safety Checks**
- Probability formatter handles undefined/null values
- Graceful fallback to "N/A" for invalid data
- Type conversion validation

***

## 📁 Project Structure

```
ai-traffic-prediction/
├── backend/
│   ├── models/
│   │   ├── best_model.joblib
│   │   ├── severity_mapping.joblib
│   │   └── feature_names.joblib
│   ├── data/
│   │   └── processed/
│   │       └── asia_accident_hotspots_enhanced.csv
│   ├── prediction_api.py
│   └── spatial_analysis.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PredictionForm.js
│   │   │   ├── ResultPage.js
│   │   │   └── ResultCard.js
│   │   └── pages/
│   └── package.json
└── README.md
```

***

## 🎯 Usage

### **1. Start Backend**
```bash
cd backend
python prediction_api.py
# Server runs on http://127.0.0.1:5000
```

### **2. Start Frontend**
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### **3. Make Predictions**
1. Fill in accident details in the form
2. Submit for real-time prediction
3. View severity level + probability + recommendations
4. Analyze hotspot risks on interactive map

***

## 🔍 Example Prediction Input

```json
{
  "datetime": "2025-11-10T13:00",
  "State Name": "Maharashtra",
  "City Name": "Mumbai",
  "Driver Age": 35,
  "Driver License Status": "Valid",
  "driver_experience": "8 years",
  "driver_speed_habit": 45,
  "vehicle_condition": "good",
  "Weather Conditions": "Clear",
  "Road Type": "Urban Road",
  "Road Condition": "Dry",
  "Lighting Conditions": "Bright",
  "Traffic Control Presence": "Lights",
  "Vehicle Type Involved": "Car",
  "alcohol_flag": 0
}
```

**Output:**
```json
{
  "prediction_summary": {
    "severity": "Minor",
    "severity_code": 0,
    "ml_probability": 78.45,
    "ml_risk_level": "LOW"
  },
  "combined_risk": {
    "travel_safe": "YES",
    "combined_recommendation": "✅ Location safe - travel allowed"
  }
}
```

***

## 🛠️ Future Enhancements

- Multi-language support
- Mobile app development (Flutter/React Native)
- Real-time traffic data integration
- Police/Hospital location proximity analysis
- Historical accident trend analysis
- User feedback loop for model retraining
- Cloud deployment (AWS/GCP/Azure)
- Advanced geospatial clustering

***

## 📝 License

This project is open-source and available under the **MIT License**.

***

## 👥 Contributors

**Project Leader:** Biswajit Sow  
**Team:** AI/ML Development Team  
**Institution:**UEM




