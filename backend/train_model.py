import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler

def train_crop_model():
    print("Generating training data...")
    # Seed for reproducibility
    np.random.seed(42)
    
    # We will generate a synthetic dataset with inputs:
    # - soil_type: clay, loamy, sandy, silt, peat
    # - rainfall: 200 to 2500 mm
    # - temperature: 10 to 45 C
    # - season: kharif, rabi, zaid
    
    n_samples = 1500
    
    soil_types = ['clay', 'loamy', 'sandy', 'silt', 'peat']
    seasons = ['kharif', 'rabi', 'zaid']
    
    data = []
    for _ in range(n_samples):
        soil = np.random.choice(soil_types)
        season = np.random.choice(seasons)
        
        # Rainfall and temperature based on season profiles
        if season == 'kharif': # Wet, warm
            rainfall = np.random.uniform(800, 2200)
            temp = np.random.uniform(24, 38)
        elif season == 'rabi': # Dry, cool
            rainfall = np.random.uniform(200, 900)
            temp = np.random.uniform(12, 26)
        else: # Zaid - dry, hot
            rainfall = np.random.uniform(100, 600)
            temp = np.random.uniform(28, 43)
            
        # Determine target crop heuristically to have some logic in training data
        if rainfall > 1300 and soil in ['clay', 'loamy']:
            crop = "Paddy (Rice)"
        elif temp < 22 and rainfall < 800 and season == 'rabi':
            crop = "Wheat"
        elif soil == 'sandy' and rainfall < 700:
            crop = "Millets"
        elif rainfall >= 600 and rainfall <= 1200 and temp >= 22 and temp <= 32:
            crop = "Maize"
        elif soil == 'sandy' and rainfall >= 600 and rainfall <= 1000:
            crop = "Groundnut"
        elif rainfall > 1500 and temp > 28:
            crop = "Sugarcane"
        elif soil in ['loamy', 'silt'] and temp > 25 and rainfall > 700:
            crop = "Cotton"
        else:
            crop = "Soybean"
            
        data.append({
            'soil_type': soil,
            'rainfall': rainfall,
            'temperature': temp,
            'season': season,
            'crop': crop
        })
        
    df = pd.DataFrame(data)
    
    # Preprocessing
    le_soil = LabelEncoder()
    df['soil_type_encoded'] = le_soil.fit_transform(df['soil_type'])
    
    le_season = LabelEncoder()
    df['season_encoded'] = le_season.fit_transform(df['season'])
    
    le_crop = LabelEncoder()
    df['crop_encoded'] = le_crop.fit_transform(df['crop'])
    
    features = ['soil_type_encoded', 'rainfall', 'temperature', 'season_encoded']
    X = df[features]
    y = df['crop_encoded']
    
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train Random Forest
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_scaled, y)
    
    # Create output dir
    os.makedirs('backend/model', exist_ok=True)
    
    # Save artifacts
    joblib.dump(clf, 'backend/model/crop_model.pkl')
    joblib.dump(scaler, 'backend/model/scaler.pkl')
    joblib.dump(le_soil, 'backend/model/le_soil.pkl')
    joblib.dump(le_season, 'backend/model/le_season.pkl')
    joblib.dump(le_crop, 'backend/model/le_crop.pkl')
    
    print("Model trained and saved successfully in backend/model/.")

if __name__ == '__main__':
    train_crop_model()
