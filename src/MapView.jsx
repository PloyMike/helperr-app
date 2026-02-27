import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Einfache Stadt-Koordinaten Map
const cityCoordinates = {
  // Deutschland
  'Berlin': [52.5200, 13.4050],
  'München': [48.1351, 11.5820],
  'Hamburg': [53.5511, 9.9937],
  'Köln': [50.9375, 6.9603],
  'Frankfurt': [50.1109, 8.6821],
  
  // Österreich
  'Wien': [48.2082, 16.3738],
  'Salzburg': [47.8095, 13.0550],
  
  // Schweiz
  'Zürich': [47.3769, 8.5417],
  'Bern': [46.9480, 7.4474],
  'Geneva': [46.2044, 6.1432],
  
  // Thailand
  'Bangkok': [13.7563, 100.5018],
  'Koh Samui': [9.5357, 100.0628],
  'Phuket': [7.8804, 98.3923],
  'Chiang Mai': [18.7883, 98.9853],
  
  // USA
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'El Paso': [31.7619, -106.4850],
  'Miami': [25.7617, -80.1918],
  
  // UK
  'London': [51.5074, -0.1278],
  'Manchester': [53.4808, -2.2426],
  
  // Frankreich
  'Paris': [48.8566, 2.3522],
  'Lyon': [45.7640, 4.8357],
  
  // Spanien
  'Madrid': [40.4168, -3.7038],
  'Barcelona': [41.3851, 2.1734],
  
  // Italien
  'Rom': [41.9028, 12.4964],
  'Mailand': [45.4642, 9.1900],
};

function getCityCoordinates(city, country) {
  // Versuche exakte Stadt
  if (cityCoordinates[city]) {
    return cityCoordinates[city];
  }
  
  // Fallback: Land-Koordinaten
  const countryDefaults = {
    'Deutschland': [51.1657, 10.4515],
    'Germany': [51.1657, 10.4515],
    'Österreich': [47.5162, 14.5501],
    'Austria': [47.5162, 14.5501],
    'Schweiz': [46.8182, 8.2275],
    'Switzerland': [46.8182, 8.2275],
    'Thailand': [15.8700, 100.9925],
    'USA': [37.0902, -95.7129],
    'United States': [37.0902, -95.7129],
    'UK': [55.3781, -3.4360],
    'United Kingdom': [55.3781, -3.4360],
    'France': [46.2276, 2.2137],
    'Frankreich': [46.2276, 2.2137],
    'Spain': [40.4637, -3.7492],
    'Spanien': [40.4637, -3.7492],
    'Italy': [41.8719, 12.5674],
    'Italien': [41.8719, 12.5674],
  };
  
  return countryDefaults[country] || [20, 0]; // Welt-Zentrum als letzter Fallback
}

function MapView({ profiles }) {
  const defaultCenter = [30, 10];
  const defaultZoom = 2;

  return (
    <div style={{ 
      height: '400px', 
      width: '100%', 
      borderRadius: 12, 
      overflow: 'hidden', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      border: '2px solid #e2e8f0'
    }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={defaultZoom} 
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ZoomControl position="topright" />
        
        {profiles.map((profile) => {
          const [lat, lng] = getCityCoordinates(profile.city, profile.country);
          
          return (
            <Marker key={profile.id} position={[lat, lng]}>
              <Popup>
                <div style={{ padding: 8, minWidth: 200 }}>
                  
                  {profile.image_url ? (
                    <img
                      src={profile.image_url}
                      alt={profile.name}
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginBottom: 12,
                        border: '2px solid #667eea',
                        display: 'block',
                        margin: '0 auto 12px'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      fontWeight: 700,
                      color: 'white',
                      margin: '0 auto 12px'
                    }}>
                      {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <h3 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700 }}>
                    {profile.name}
                  </h3>
                  <p style={{ margin: '0 0 4px 0', color: '#667eea', fontWeight: 600 }}>
                    {profile.job}
                  </p>
                  <p style={{ margin: '0 0 8px 0', fontSize: 14, color: '#718096' }}>
                    📍 {profile.city}, {profile.country}
                  </p>
                  <p style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 700 }}>
                    {profile.price}
                  </p>
                  <button
                    onClick={() => window.navigateTo('profile', profile)}
                    style={{
                      width: '100%',
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Profil ansehen
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
