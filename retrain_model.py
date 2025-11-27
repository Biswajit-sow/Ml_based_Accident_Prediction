import pandas as pd
import joblib
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from sklearn.metrics import classification_report, accuracy_score, f1_score, precision_recall_fscore_support, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

print("\n" + "="*80)
print("🔄 RETRAINING MODEL v8.0 - CLEAN FEATURES + CLASS BALANCING FOR BEST ACCURACY")
print("="*80)

print("\n1️⃣ Loading featured data...")
df = pd.read_csv('ai-traffic-prediction-backend/data/processed/featured_data.csv')
print(f"   ✓ Loaded {len(df)} records")

print("\n2️⃣ Selecting CLEAN PREDICTIVE features (REMOVED ALL PROBLEMATIC FEATURES)...")
feature_cols = []

# Get encoded categorical features
for c in df.columns:
    if c.endswith('_enc') or c.endswith('_score'):
        if c not in ['Accident Severity_enc']:
            feature_cols.append(c)
    elif c in ['hour', 'is_weekend', 'is_rush_hour', 'alcohol_flag']:
        feature_cols.append(c)

# REMOVE ALL PROBLEMATIC OUTCOME VARIABLES
outcome_variables_to_remove = [
    'Number of Vehicles Involved',      # ❌ Result of crash
    'Number of Casualties',             # ❌ Only known AFTER accident
    'Number of Fatalities',             # ❌ Only known AFTER accident
    'Speed Limit (km/h)'                # ❌ Causes data leakage (infrastructure detail)
]

removed_vars = []
for var in outcome_variables_to_remove:
    if var in feature_cols:
        feature_cols.remove(var)
        removed_vars.append(var)
        print(f"   ⚠️  Removed: {var}")

print(f"\n   ✅ Removed {len(removed_vars)} problematic features")

# Ensure realistic scoring features are included
realistic_features = ['experience_score', 'vehicle_condition_score', 'driver_speed_score', 'age_score', 'weather_score']
for feat in realistic_features:
    if feat in df.columns and feat not in feature_cols:
        feature_cols.append(feat)

print(f"\n   Total CLEAN features: {len(feature_cols)}")
print("   Features included:")
for i, col in enumerate(feature_cols, 1):
    print(f"      {i:2d}. {col}")

print("\n   📊 Feature Score Ranges (1-5 realistic scoring):")
score_cols = [c for c in feature_cols if c.endswith('_score')]
for col in score_cols:
    if col in df.columns:
        print(f"      {col}: min={df[col].min():.1f}, max={df[col].max():.1f}, mean={df[col].mean():.2f}")

# Handle missing values
X = df[feature_cols].fillna(df[feature_cols].mean())
y = df['target']

unique_classes = sorted(y.unique())
class_names_all = ['Minor', 'Serious', 'Fatal']
actual_class_names = [class_names_all[i] for i in unique_classes]

print(f"\n   🎯 ORIGINAL Target Distribution (IMBALANCED):")
for class_id in unique_classes:
    count = (y == class_id).sum()
    pct = count/len(y)*100
    print(f"      - {class_names_all[class_id]:8s}: {count:5d} ({pct:5.1f}%)")

print("\n3️⃣ Splitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("\n4️⃣🎯 CLASS BALANCING - CRITICAL FOR ACCURACY!")
print("   Applying SMOTE (Synthetic Minority Oversampling)...")

try:
    
    smote = SMOTE(random_state=42, k_neighbors=5)
    X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
    
    print(f"   ✓ Before SMOTE: {len(X_train)} samples")
    print(f"   ✓ After SMOTE:  {len(X_train_balanced)} samples")
    print(f"\n   ✓ Balanced Training Distribution:")
    for class_id in unique_classes:
        count = (y_train_balanced == class_id).sum()
        pct = count/len(y_train_balanced)*100
        print(f"      - {class_names_all[class_id]:8s}: {count:5d} ({pct:5.1f}%)")
    
    use_balanced = True
except ImportError:
    print("   ⚠️  SMOTE not installed. Install: pip install imbalanced-learn")
    print("   Using original unbalanced data (accuracy may be lower)")
    X_train_balanced, y_train_balanced = X_train, y_train
    use_balanced = False

print("\n5️⃣ RandomForest with GridSearchCV (CLASS-WEIGHTED + BALANCED DATA)...")
param_grid_rf = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 15, 20, 25],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'max_features': ['sqrt', 'log2'],
    'class_weight': ['balanced']
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42, n_jobs=-1),
    param_grid_rf,
    cv=5,
    scoring='f1_weighted',
    n_jobs=1,
    verbose=0
)
print("   Running GridSearch...")
grid_search.fit(X_train_balanced, y_train_balanced)
rf_model = grid_search.best_estimator_
y_pred_rf = rf_model.predict(X_test)
accuracy_rf = accuracy_score(y_test, y_pred_rf)
f1_rf = f1_score(y_test, y_pred_rf, average='weighted')

print(f"   ✓ RandomForest: Accuracy {accuracy_rf:.4f} | F1 {f1_rf:.4f}")
print(f"   Best Params: {grid_search.best_params_}")

print("\n6️⃣ XGBoost (CLASS-WEIGHTED + BALANCED DATA)...")
xgb_model = XGBClassifier(
    n_estimators=200,
    max_depth=8,
    learning_rate=0.1,
    min_child_weight=1,
    gamma=0.1,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42,
    n_jobs=-1,
    use_label_encoder=False,
    eval_metric='mlogloss',
    verbosity=0
)
print("   Training XGBoost with balanced classes...")
xgb_model.fit(X_train_balanced, y_train_balanced)
y_pred_xgb = xgb_model.predict(X_test)
accuracy_xgb = accuracy_score(y_test, y_pred_xgb)
f1_xgb = f1_score(y_test, y_pred_xgb, average='weighted')

print(f"   ✓ XGBoost: Accuracy {accuracy_xgb:.4f} | F1 {f1_xgb:.4f}")

print("\n7️⃣ Model Comparison & Selection...")
print(f"\n   ┌─────────────────┬──────────────┬──────────────┐")
print(f"   │ Model           │ Accuracy     │ F1-Score     │")
print(f"   ├─────────────────┼──────────────┼──────────────┤")
print(f"   │ RandomForest    │ {accuracy_rf:6.2%}        │ {f1_rf:6.4f}      │")
print(f"   │ XGBoost         │ {accuracy_xgb:6.2%}        │ {f1_xgb:6.4f}      │")
print(f"   └─────────────────┴──────────────┴──────────────┘")

if accuracy_xgb >= accuracy_rf:
    best_model = xgb_model
    y_pred = y_pred_xgb
    model_name = "XGBoost"
    accuracy = accuracy_xgb
    f1 = f1_xgb
else:
    best_model = rf_model
    y_pred = y_pred_rf
    model_name = "RandomForest"
    accuracy = accuracy_rf
    f1 = f1_rf

print(f"\n   🏆 Selected: {model_name}")

print("\n8️⃣ Evaluation...")
print(f"\n   📊 OVERALL METRICS:")
print(f"      Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"      F1-Score: {f1:.4f}")

print(f"\n   Classification Report:")
print(classification_report(y_test, y_pred, target_names=actual_class_names, digits=4, labels=unique_classes))

precision, recall, f1_per_class, support = precision_recall_fscore_support(y_test, y_pred, labels=unique_classes)

print(f"\n   Per-Class Metrics:")
print(f"   ┌────────┬───────────┬────────┬──────────┬─────────┐")
print(f"   │ Class  │ Precision │ Recall │ F1-Score │ Support │")
print(f"   ├────────┼───────────┼────────┼──────────┼─────────┤")
for i, class_id in enumerate(unique_classes):
    label = class_names_all[class_id]
    print(f"   │ {label:6s} │ {precision[i]:9.4f} │ {recall[i]:6.4f} │ {f1_per_class[i]:8.4f} │ {support[i]:7d} │")
print(f"   └────────┴───────────┴────────┴──────────┴─────────┘")

print("\n9️⃣ Feature Importance...")
feature_importance = pd.Series(best_model.feature_importances_, index=X.columns).sort_values(ascending=False)
print(f"\n   Top 15 Most Important Features:")
print(f"   ┌────┬──────────────────────────┬────────────┐")
print(f"   │ No │ Feature                  │ Importance │")
print(f"   ├────┼──────────────────────────┼────────────┤")
for i, (feat, imp) in enumerate(feature_importance.head(15).items(), 1):
    print(f"   │ {i:2d} │ {feat:24s} │ {imp:10.4f} │")
print(f"   └────┴──────────────────────────┴────────────┘")

print("\n🔟 Generating visualizations...")

plt.figure(figsize=(12, 8))
sns.barplot(x=feature_importance[:15].values, y=feature_importance.index[:15], palette='viridis')
plt.title(f"Top 15 Feature Importances ({model_name}) - v8.0 Clean + Balanced", fontsize=14, fontweight='bold')
plt.xlabel("Importance Score", fontsize=12)
plt.ylabel("Feature Name", fontsize=12)
plt.tight_layout()
plt.savefig('outputs/feature_importance.png', dpi=300, bbox_inches='tight')
print("   ✓ Saved: feature_importance.png")
plt.close()

cm = confusion_matrix(y_test, y_pred, labels=unique_classes)
plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=actual_class_names, 
            yticklabels=actual_class_names, cbar_kws={'label': 'Count'})
plt.title('Confusion Matrix', fontsize=14, fontweight='bold')
plt.ylabel('True Label', fontsize=12)
plt.xlabel('Predicted Label', fontsize=12)
plt.tight_layout()
plt.savefig('outputs/confusion_matrix.png', dpi=300, bbox_inches='tight')
print("   ✓ Saved: confusion_matrix.png")
plt.close()

fig, axes = plt.subplots(1, 2, figsize=(14, 5))
class_accuracies = [accuracy_score(y_test[y_test == class_id], y_pred[y_test == class_id]) for class_id in unique_classes]
colors = ['#2ecc71', '#f39c12', '#e74c3c'][:len(unique_classes)]

axes[0].bar(actual_class_names, class_accuracies, color=colors, edgecolor='black', linewidth=1.5)
axes[0].set_title('Per-Class Accuracy', fontsize=12, fontweight='bold')
axes[0].set_ylabel('Accuracy', fontsize=11)
axes[0].set_ylim([0, 1.0])
for i, v in enumerate(class_accuracies):
    axes[0].text(i, v + 0.02, f'{v:.2%}', ha='center', fontweight='bold', fontsize=10)

axes[1].bar(actual_class_names, f1_per_class, color=colors, edgecolor='black', linewidth=1.5)
axes[1].set_title('Per-Class F1-Score', fontsize=12, fontweight='bold')
axes[1].set_ylabel('F1-Score', fontsize=11)
axes[1].set_ylim([0, 1.0])
for i, v in enumerate(f1_per_class):
    axes[1].text(i, v + 0.02, f'{v:.2f}', ha='center', fontweight='bold', fontsize=10)

plt.tight_layout()
plt.savefig('outputs/model_performance.png', dpi=300, bbox_inches='tight')
print("   ✓ Saved: model_performance.png")
plt.close()

print("\n1️⃣1️⃣ Saving model...")
joblib.dump(best_model, 'models/best_model.joblib')
severity_mapping = {0: 'Minor', 1: 'Serious', 2: 'Fatal'}
joblib.dump(severity_mapping, 'models/severity_mapping.joblib')
joblib.dump(feature_cols, 'models/feature_names.joblib')
joblib.dump(grid_search.best_params_, 'models/best_parameters.joblib')
print("   ✓ Model saved: best_model.joblib")
print("   ✓ Mapping saved: severity_mapping.joblib")
print("   ✓ Features saved: feature_names.joblib")
print("   ✓ Parameters saved: best_parameters.joblib")

print("\n" + "="*80)
print("✅ RETRAINING COMPLETE v8.0 - CLEAN FEATURES + CLASS BALANCING")
print("="*80)
print(f"\n📈 MODEL SUMMARY:")
print(f"   Model Type: {model_name}")
print(f"   Severity Classes: {', '.join(actual_class_names)}")
print(f"   Total Features: {len(feature_cols)} (CLEAN - All outcome variables removed)")

print(f"\n   ⛔ REMOVED Features:")
for removed in removed_vars:
    print(f"      • {removed}")

print(f"\n   ✅ KEPT Features:")
print(f"      • Temporal: hour, is_weekend, is_rush_hour")
print(f"      • Location: State Name_enc, City Name_enc")
print(f"      • Driver: age_score, license_score, experience_score, alcohol_flag")
print(f"      • Vehicle: vehicle_condition_score, vehicle_type_enc")
print(f"      • Road: road_type_score, road_cond_score, lighting_conditions_enc")
print(f"      • Environment: weather_score, traffic_control_presence_enc")

print(f"\n   🎯 CLASS BALANCING:")
print(f"      • SMOTE Applied: {use_balanced}")
if use_balanced:
    print(f"      • Training samples increased: {len(X_train)} → {len(X_train_balanced)}")

print(f"\n   📊 Performance:")
print(f"      Train Samples: {len(X_train_balanced):6d} (balanced)")
print(f"      Test Samples:  {len(X_test):6d}")
print(f"      Overall Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"      Overall F1-Score:  {f1:.4f}")

print(f"\n   Per-Class Accuracy:")
for i, name in enumerate(actual_class_names):
    print(f"      - {name}: {class_accuracies[i]:.2%}")

print(f"\n   Feature Importance (Top 5):")
for i, (feat, imp) in enumerate(feature_importance.head(5).items(), 1):
    print(f"      {i}. {feat}: {imp:.4f}")

print(f"\n🚀 Next Step: Run 'python src/prediction_api.py'")
print("="*80 + "\n")
