import pandas as pd
import folium
from sklearn.cluster import DBSCAN
import branca.colormap as cm
import numpy as np
import os
from math import radians, cos, sin, asin, sqrt


class HotspotAnalyzer:
    def __init__(self, csv_path='asia_accident_hotspots_enhanced.csv'):
        """
        Initialize HotspotAnalyzer with CSV data loading
        csv_path: Path to the enhanced hotspots CSV file
        """
        self.hotspots = []
        self.asia_hotspots_df = None
        self.asia_hotspots = []
        self.load_asia_hotspots_from_csv(csv_path)
    
    def load_asia_hotspots_from_csv(self, csv_path):
        """
        Load Asia hotspots from CSV file for better performance and flexibility
        CSV can be easily updated without code changes
        """
        try:
            if os.path.exists(csv_path):
                self.asia_hotspots_df = pd.read_csv(csv_path)
                print(f"✅ Loaded {len(self.asia_hotspots_df)} hotspots from CSV: {csv_path}")
                # Convert DataFrame to list format
                self.asia_hotspots = self.dataframe_to_hotspots_list()
            else:
                print(f"⚠️ CSV file not found at {csv_path}")
                print("✅ Using default hardcoded hotspots instead")
                self.asia_hotspots = self.get_default_asia_hotspots()
        except Exception as e:
            print(f"❌ Error loading CSV: {str(e)}")
            print("✅ Falling back to default hotspots")
            self.asia_hotspots = self.get_default_asia_hotspots()
    
    def dataframe_to_hotspots_list(self):
        """Convert DataFrame to hotspots list format"""
        if self.asia_hotspots_df is None or self.asia_hotspots_df.empty:
            return []
        
        hotspots = []
        for _, row in self.asia_hotspots_df.iterrows():
            hotspot = {
                'id': row.get('id'),
                'name': row.get('name'),
                'lat': row.get('latitude'),
                'lon': row.get('longitude'),
                'count': row.get('accident_count'),
                'severity': row.get('severity'),
                'country': row.get('country'),
                'city': row.get('city'),
                'road_type': row.get('road_type'),
                'peak_hours': row.get('peak_hours'),
                'risk_score': row.get('risk_score'),
                'fatality_rate': row.get('fatality_rate'),
                'injury_rate': row.get('injury_rate'),
                'avg_speed_limit': row.get('avg_speed_limit'),
                'weather_sensitive': row.get('weather_sensitive'),
                'lighting_condition': row.get('lighting_condition'),
                'traffic_density': row.get('traffic_density'),
                'construction_zone': row.get('construction_zone'),
                'toll_booth': row.get('toll_booth'),
                'data_reliability': row.get('data_reliability'),
                'monitoring_cameras': row.get('monitoring_cameras'),
                'emergency_response_time_min': row.get('emergency_response_time_min')
            }
            hotspots.append(hotspot)
        return hotspots
    
    def get_default_asia_hotspots(self):
        """Fallback to default hardcoded hotspots if CSV not available"""
        return [
            {'name': 'Delhi-NCR Highway', 'lat': 28.6139, 'lon': 77.2090, 'count': 8532, 'severity': 'CRITICAL', 'country': 'India', 'risk_score': 95},
            {'name': 'Mumbai-Pune Expressway', 'lat': 19.0760, 'lon': 72.8777, 'count': 6745, 'severity': 'HIGH', 'country': 'India', 'risk_score': 88},
            {'name': 'Bangalore-Chennai Highway', 'lat': 13.0827, 'lon': 80.2707, 'count': 5234, 'severity': 'HIGH', 'country': 'India', 'risk_score': 82},
            {'name': 'Hyderabad Ring Road', 'lat': 17.3850, 'lon': 78.4867, 'count': 4890, 'severity': 'HIGH', 'country': 'India', 'risk_score': 80},
            {'name': 'Kolkata-New Delhi Highway', 'lat': 22.5726, 'lon': 88.3639, 'count': 4567, 'severity': 'HIGH', 'country': 'India', 'risk_score': 78},
            {'name': 'Gujarat Industrial Corridor', 'lat': 23.0225, 'lon': 72.5714, 'count': 3876, 'severity': 'MEDIUM', 'country': 'India', 'risk_score': 70},
            {'name': 'Jaipur City Center', 'lat': 26.9124, 'lon': 75.7873, 'count': 3654, 'severity': 'MEDIUM', 'country': 'India', 'risk_score': 68},
            {'name': 'Chennai Outer Ring Road', 'lat': 13.1939, 'lon': 80.1741, 'count': 3245, 'severity': 'MEDIUM', 'country': 'India', 'risk_score': 65},
            {'name': 'Beijing-Zhuhai Expressway', 'lat': 39.9042, 'lon': 116.4074, 'count': 7654, 'severity': 'HIGH', 'country': 'China', 'risk_score': 85},
            {'name': 'Shanghai Urban Ring', 'lat': 31.2304, 'lon': 121.4737, 'count': 6432, 'severity': 'HIGH', 'country': 'China', 'risk_score': 83},
            {'name': 'Guangzhou Metropolitan', 'lat': 23.1291, 'lon': 113.2644, 'count': 5123, 'severity': 'MEDIUM', 'country': 'China', 'risk_score': 72},
            {'name': 'Chengdu Ring Road', 'lat': 30.5728, 'lon': 104.0668, 'count': 4876, 'severity': 'MEDIUM', 'country': 'China', 'risk_score': 74},
            {'name': 'Bangkok Highway System', 'lat': 13.7563, 'lon': 100.5018, 'count': 5345, 'severity': 'HIGH', 'country': 'Thailand', 'risk_score': 81},
            {'name': 'Pattaya Coastal Road', 'lat': 12.9251, 'lon': 100.8863, 'count': 2987, 'severity': 'MEDIUM', 'country': 'Thailand', 'risk_score': 66},
            {'name': 'Jakarta Urban Area', 'lat': -6.2088, 'lon': 106.8456, 'count': 6234, 'severity': 'HIGH', 'country': 'Indonesia', 'risk_score': 84},
            {'name': 'Surabaya Highway', 'lat': -7.2575, 'lon': 112.7521, 'count': 3456, 'severity': 'MEDIUM', 'country': 'Indonesia', 'risk_score': 69},
            {'name': 'Manila Metropolitan', 'lat': 14.5995, 'lon': 120.9842, 'count': 4567, 'severity': 'HIGH', 'country': 'Philippines', 'risk_score': 79},
            {'name': 'Cebu Coastal Highway', 'lat': 10.3157, 'lon': 123.8854, 'count': 2123, 'severity': 'MEDIUM', 'country': 'Philippines', 'risk_score': 61},
            {'name': 'Hanoi Urban Ring', 'lat': 21.0285, 'lon': 105.8542, 'count': 5432, 'severity': 'HIGH', 'country': 'Vietnam', 'risk_score': 80},
            {'name': 'Ho Chi Minh City Expressway', 'lat': 10.7769, 'lon': 106.7009, 'count': 4234, 'severity': 'MEDIUM', 'country': 'Vietnam', 'risk_score': 73},
            {'name': 'Kuala Lumpur Ring', 'lat': 3.1390, 'lon': 101.6869, 'count': 3876, 'severity': 'MEDIUM', 'country': 'Malaysia', 'risk_score': 70},
            {'name': 'Penang Bridge Corridor', 'lat': 5.2833, 'lon': 100.2167, 'count': 2345, 'severity': 'MEDIUM', 'country': 'Malaysia', 'risk_score': 63},
            {'name': 'Central Business District', 'lat': 1.3521, 'lon': 103.8198, 'count': 2134, 'severity': 'LOW', 'country': 'Singapore', 'risk_score': 45},
            {'name': 'Seoul Ring Road', 'lat': 37.5665, 'lon': 126.9780, 'count': 3456, 'severity': 'MEDIUM', 'country': 'South Korea', 'risk_score': 68},
            {'name': 'Tokyo Metropolitan', 'lat': 35.6762, 'lon': 139.6503, 'count': 2987, 'severity': 'MEDIUM', 'country': 'Japan', 'risk_score': 62},
        ]
    
    def haversine(self, lat1, lon1, lat2, lon2):
        """Calculate distance between two coordinates in km"""
        lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in km
        return c * r
    
    def classify_distance_based_risk(self, distance_km):
        """
        Classify risk level based on distance from hotspot
        Distance Ranges:
        - 0-10 km: HIGH CRITICAL RED ZONE (🔴🔴🔴)
        - 10-50 km: CRITICAL ZONE (🔴🔴)
        - 50-100 km: MEDIUM RISK ZONE (🟡)
        - 100-150 km: MEDIUM RISK ZONE (🟡)
        - 150-300 km: LOW RISK ZONE (🟢)
        - 300+ km: NO RISK (✅)
        """
        if distance_km <= 10:
            return {
                'risk_level': 'HIGH CRITICAL RED ZONE',
                'color': '#8B0000',
                'emoji': '🔴🔴🔴',
                'severity': 'EXTREME',
                'travel_recommendation': '⛔ DANGER: DO NOT TRAVEL - Extreme accident risk in this area',
                'confidence': 95
            }
        elif distance_km <= 50:
            return {
                'risk_level': 'CRITICAL ZONE',
                'color': '#FF0000',
                'emoji': '🔴🔴',
                'severity': 'CRITICAL',
                'travel_recommendation': '⚠️ HIGH ALERT: Avoid this area if possible. If necessary, drive extremely carefully',
                'confidence': 90
            }
        elif distance_km <= 100:
            return {
                'risk_level': 'MEDIUM RISK ZONE',
                'color': '#FFD700',
                'emoji': '🟡',
                'severity': 'HIGH',
                'travel_recommendation': '⚠️ CAUTION: Elevated accident risk. Increase alertness and reduce speed',
                'confidence': 75
            }
        elif distance_km <= 150:
            return {
                'risk_level': 'MEDIUM RISK ZONE',
                'color': '#FFD700',
                'emoji': '🟡',
                'severity': 'MEDIUM',
                'travel_recommendation': '⚠️ ALERT: Moderate accident risk. Stay vigilant',
                'confidence': 60
            }
        elif distance_km <= 300:
            return {
                'risk_level': 'LOW RISK ZONE',
                'color': '#90EE90',
                'emoji': '🟢',
                'severity': 'LOW',
                'travel_recommendation': '✅ SAFE: Low accident risk. Travel normally with standard precautions',
                'confidence': 40
            }
        else:
            return {
                'risk_level': 'NO RISK - SAFE TO TRAVEL',
                'color': '#00AA00',
                'emoji': '✅',
                'severity': 'NONE',
                'travel_recommendation': '✅ CLEAR: No significant accident hotspots nearby. You can travel anywhere safely',
                'confidence': 10
            }
    
    def fit(self, df: pd.DataFrame, eps=0.05, min_samples=10):
        """Identify accident hotspots using DBSCAN clustering"""
        coords = df[['latitude', 'longitude']].dropna().values
        clustering = DBSCAN(eps=eps, min_samples=min_samples).fit(coords)
        df = df.loc[df[['latitude', 'longitude']].dropna().index].copy()
        df['cluster'] = clustering.labels_
        for cid in set(clustering.labels_):
            if cid == -1:
                continue
            subset = df[df['cluster'] == cid]
            count = len(subset)
            center = (subset['latitude'].mean(), subset['longitude'].mean())
            severity_data = subset.get('Accident Severity', pd.Series()).value_counts()
            fatal_count = severity_data.get('Fatal', 0)
            severity = 'CRITICAL' if fatal_count > count * 0.3 else ('HIGH' if count > 100 else 'MEDIUM')
            
            self.hotspots.append({
                'cluster_id': cid,
                'center': center,
                'count': count,
                'severity': severity
            })
        self.hotspots.sort(key=lambda x: x['count'], reverse=True)
        return self.hotspots
    
    def save_map(self, filename='../outputs/accident_hotspots.html', top_n=10):
        """Create and save an interactive map of India hotspots"""
        center = self.hotspots[0]['center'] if self.hotspots else (23.0, 79.0)
        m = folium.Map(location=center, zoom_start=6)
        
        counts = [h['count'] for h in self.hotspots[:top_n]]
        colormap = cm.LinearColormap(['yellow', 'orange', 'red'],
                                     vmin=min(counts), vmax=max(counts))
        colormap.caption = 'Accident Count'
        
        for h in self.hotspots[:top_n]:
            count = h['count']
            color = colormap(count)
            radius = max(5, count / 5)
            folium.CircleMarker(
                location=h['center'],
                radius=radius,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.7,
                popup=f"Cluster {h['cluster_id']}: {count} accidents | Severity: {h.get('severity', 'UNKNOWN')}",
                tooltip=f"Cluster {h['cluster_id']}: {count} accidents"
            ).add_to(m)
        
        m.add_child(colormap)
        os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
        m.save(filename)
        return filename
    
    def find_nearby_hotspots(self, user_lat, user_lon, radius_km=500):
        """Find hotspots and classify by distance-based risk"""
        nearby = []
        for hotspot in self.asia_hotspots:
            distance = self.haversine(user_lat, user_lon, hotspot['lat'], hotspot['lon'])
            if distance <= radius_km:
                risk_info = self.classify_distance_based_risk(distance)
                hotspot_with_risk = {
                    'name': hotspot['name'],
                    'lat': hotspot['lat'],
                    'lon': hotspot['lon'],
                    'count': hotspot['count'],
                    'severity': hotspot['severity'],
                    'distance_km': round(distance, 2),
                    'risk_level': risk_info['risk_level'],
                    'travel_recommendation': risk_info['travel_recommendation'],
                    'confidence': risk_info['confidence'],
                    'emoji': risk_info['emoji'],
                    'risk_score': hotspot.get('risk_score'),
                    'fatality_rate': hotspot.get('fatality_rate'),
                    'emergency_response_time': hotspot.get('emergency_response_time_min')
                }
                nearby.append(hotspot_with_risk)
        
        nearby.sort(key=lambda x: x['distance_km'])
        return nearby
    
    def get_hotspot_analysis(self, user_lat, user_lon, radius_km=500):
        """Get comprehensive hotspot analysis with distance-based risk classification"""
        nearby = self.find_nearby_hotspots(user_lat, user_lon, radius_km)
        
        if not nearby:
            return {
                'status': 'NO_HOTSPOTS',
                'message': '✅ CLEAR: No accident hotspots detected in this region',
                'overall_risk_level': 'NO RISK - SAFE TO TRAVEL',
                'travel_permission': '✅ ALLOWED - You can travel anywhere in this region safely',
                'nearby_hotspots': [],
                'total_nearby': 0,
                'critical_zones': 0,
                'recommendation': 'Safe to travel. Maintain standard driving precautions.'
            }
        
        extreme_risk = [h for h in nearby if h['risk_level'] == 'HIGH CRITICAL RED ZONE']
        critical = [h for h in nearby if h['risk_level'] == 'CRITICAL ZONE']
        medium_risk = [h for h in nearby if h['risk_level'] == 'MEDIUM RISK ZONE']
        low_risk = [h for h in nearby if h['risk_level'] == 'LOW RISK ZONE']
        
        if extreme_risk:
            overall_travel = '⛔ NOT ALLOWED - Extreme danger zones nearby'
            overall_risk = 'EXTREME - DO NOT TRAVEL'
        elif critical:
            overall_travel = '⚠️ RESTRICTED - High caution required'
            overall_risk = 'CRITICAL - TRAVEL WITH EXTREME CARE'
        elif medium_risk:
            overall_travel = '⚠️ ALLOWED WITH CAUTION - Drive carefully'
            overall_risk = 'MEDIUM - ELEVATED ALERTNESS REQUIRED'
        elif low_risk:
            overall_travel = '✅ ALLOWED - Travel with normal precautions'
            overall_risk = 'LOW - MINIMAL RISK'
        else:
            overall_travel = '✅ ALLOWED - Safe to travel anywhere'
            overall_risk = 'NONE - NO RISK'
        
        return {
            'status': 'ANALYSIS_COMPLETE',
            'overall_risk_level': overall_risk,
            'travel_permission': overall_travel,
            'message': f'Found {len(nearby)} hotspots within {radius_km}km',
            'nearby_hotspots': nearby[:15],
            'total_nearby': len(nearby),
            'risk_breakdown': {
                'extreme_critical_red_zones': len(extreme_risk),
                'critical_zones': len(critical),
                'medium_risk_zones': len(medium_risk),
                'low_risk_zones': len(low_risk)
            },
            'closest_danger': nearby[0] if nearby else None,
            'recommendation': f'{overall_travel} - {[h["travel_recommendation"] for h in nearby[:1]][0] if nearby else "Safe to travel"}'
        }
    
    def generate_asia_hotspot_map(self, user_lat=None, user_lon=None, radius_km=500, filename='../outputs/asia_hotspots_map.html'):
        """
        Generate interactive Asia-wide hotspot map with distance-based risk
        If no hotspots found within radius, display large green NO RISK ZONE
        """
        center_lat = user_lat if user_lat else 34.0479
        center_lon = user_lon if user_lon else 100.6197
        
        m = folium.Map(location=[center_lat, center_lon], zoom_start=4, tiles='OpenStreetMap')
        
        hotspots_found = False
        
        # Add user location marker
        if user_lat and user_lon:
            folium.Marker(
                location=[user_lat, user_lon],
                popup="Your Location",
                icon=folium.Icon(color='blue', icon='info-sign'),
                tooltip="Your Starting Point"
            ).add_to(m)
        
        # Find and add nearby hotspots
        nearby_hotspots = self.find_nearby_hotspots(user_lat, user_lon, radius_km) if user_lat and user_lon else self.asia_hotspots
        
        for hotspot in nearby_hotspots[:20]:
            lat, lon = hotspot['lat'], hotspot['lon']
            name = hotspot['name']
            count = hotspot['count']
            distance = hotspot.get('distance_km', 0)
            
            # Classify risk based on distance
            risk_info = self.classify_distance_based_risk(distance)
            color = risk_info['color']
            
            radius = max(10, min(50, count / 50))
            
            # Enhanced popup with CSV data
            popup_text = f"""
            <b>{name}</b><br>
            Distance: {distance} km<br>
            Risk Level: {risk_info['risk_level']}<br>
            Accidents: {count}<br>
            Fatality Rate: {hotspot.get('fatality_rate', 'N/A')}<br>
            Emergency Response: {hotspot.get('emergency_response_time', 'N/A')} min<br>
            Recommendation: {risk_info['travel_recommendation']}
            """
            
            folium.CircleMarker(
                location=[lat, lon],
                radius=radius,
                color=color,
                fill=True,
                fill_color=color,
                fill_opacity=0.7,
                weight=2,
                popup=popup_text,
                tooltip=f"{name} - {risk_info['emoji']} {risk_info['risk_level']}"
            ).add_to(m)
            
            hotspots_found = True
        
        # NEW: Show NO RISK ZONE if no hotspots
        if not hotspots_found and user_lat and user_lon:
            folium.Circle(
                location=[user_lat, user_lon],
                radius=radius_km * 1000,
                color='#00C853',
                fill=True,
                fill_color='#00C853',
                fill_opacity=0.25,
                weight=3,
                popup=f"✅ NO RISK ZONE<br>Within {radius_km} km radius<br>You can travel anywhere in this region safely!",
                tooltip="✅ NO RISK ZONE - Safe to travel"
            ).add_to(m)
            
            folium.Marker(
                location=[user_lat, user_lon],
                icon=folium.DivIcon(html=f"""
                    <div style="
                        font-size: 16px; 
                        font-weight: bold; 
                        color: #00C853;
                        text-shadow: 1px 1px 2px white;
                        background: rgba(255,255,255,0.7);
                        padding: 5px 10px;
                        border-radius: 5px;
                        border: 2px solid #00C853;
                    ">
                    ✅ NO RISK ZONE
                    </div>
                """),
                popup="✅ NO RISK ZONE<br>Safe to travel in this area!"
            ).add_to(m)
        
        # Enhanced legend with CSV metrics
        legend_html = '''
        <div style="position: fixed; 
                    bottom: 50px; right: 50px; width: 320px; height: 340px; 
                    background-color: white; border:2px solid grey; z-index:9999; 
                    font-size:12px; padding: 10px; border-radius: 5px; overflow-y: auto;">
        <p style="margin: 0; font-weight: bold; font-size: 14px;">📍 Risk Zone Legend</p>
        <hr style="margin: 5px 0;">
        <p><span style="color: #8B0000; font-weight: bold;">🔴🔴🔴</span> 0-10 km: HIGH CRITICAL RED</p>
        <p><span style="color: #FF0000; font-weight: bold;">🔴🔴</span> 10-50 km: CRITICAL ZONE</p>
        <p><span style="color: #FFD700; font-weight: bold;">🟡</span> 50-150 km: MEDIUM RISK</p>
        <p><span style="color: #90EE90; font-weight: bold;">🟢</span> 150-300 km: LOW RISK</p>
        <p><span style="color: #00AA00; font-weight: bold;">✅</span> 300+ km: NO RISK</p>
        <p><span style="color: #00C853; font-weight: bold;">✅</span> No Hotspots: SAFE ZONE</p>
        <hr style="margin: 5px 0;">
        <p style="font-size: 11px; margin: 5px 0; font-style: italic;">
        📊 Enhanced Data from CSV | 🔄 Easily Updatable
        </p>
        </div>
        '''
        m.get_root().html.add_child(folium.Element(legend_html))
        
        os.makedirs(os.path.dirname(filename) or '.', exist_ok=True)
        m.save(filename)
        return filename


# Main execution
if __name__ == '__main__':
    try:
        print("\n" + "="*80)
        print("🚀 INITIALIZING HOTSPOT ANALYZER WITH CSV DATA")
        print("="*80)
        
        # Initialize with CSV file
        analyzer = HotspotAnalyzer(csv_path='asia_accident_hotspots_enhanced.csv')
        
        print("\n" + "="*80)
        print("🧪 TESTING DISTANCE-BASED RISK CLASSIFICATION (Mumbai)")
        print("="*80)
        
        analysis = analyzer.get_hotspot_analysis(user_lat=19.0760, user_lon=72.8777, radius_km=500)
        
        print(f"\n✅ Overall Risk Level: {analysis['overall_risk_level']}")
        print(f"✅ Travel Permission: {analysis['travel_permission']}")
        print(f"\n📊 Risk Breakdown:")
        for key, val in analysis['risk_breakdown'].items():
            print(f"   • {key}: {val}")
        
        print(f"\n🔍 Closest Danger:")
        if analysis['closest_danger']:
            closest = analysis['closest_danger']
            print(f"   • Name: {closest['name']}")
            print(f"   • Distance: {closest['distance_km']} km")
            print(f"   • Risk Level: {closest['risk_level']} {closest['emoji']}")
            print(f"   • Fatality Rate: {closest.get('fatality_rate', 'N/A')}")
            print(f"   • Emergency Response: {closest.get('emergency_response_time', 'N/A')} min")
        
        print("\n" + "="*80 + "\n")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
