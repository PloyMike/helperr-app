import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const cityCoordinates = {
  'Berlin': [52.5200, 13.4050],
  'München': [48.1351, 11.5820],
  'Hamburg': [53.5511, 9.9937],
  'Köln': [50.9375, 6.9603],
  'Frankfurt': [50.1109, 8.6821],
  'Wien': [48.2082, 16.3738],
  'Salzburg': [47.8095, 13.0550],
  'Zürich': [47.3769, 8.5417],
  'Bern': [46.9480, 7.4474],
  'Geneva': [46.2044, 6.1432],
  'Bangkok': [13.7563, 100.5018],
  'Koh Samui': [9.5357, 100.0628],
  'Phuket': [7.8804, 98.3923],
  'Chiang Mai': [18.7883, 98.9853],
  'New York': [40.7128, -74.0060],
  'Los Angeles': [34.0522, -118.2437],
  'Chicago': [41.8781, -87.6298],
  'El Paso': [31.7619, -106.4850],
  'Miami': [25.7617, -80.1918],
  'London': [51.5074, -0.1278],
  'Manchester': [53.4808, -2.2426],
  'Paris': [48.8566, 2.3522],
  'Lyon': [45.7640, 4.8357],
  'Madrid': [40.4168, -3.7038],
  'Barcelona': [41.3851, 2.1734],
  'Rom': [41.9028, 12.4964],
  'Mailand': [45.4642, 9.1900],
};

function getCityCoordinates(city, country) {
  if (cityCoordinates[city]) {
    return cityCoordinates[city];
  }
  
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
  
  return countryDefaults[country] || [20, 0];
}

function MapView({ profiles }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const defaultCenter = [30, 10];
  const defaultZoom = isMobile ? 1 : 2;
  const mapHeight = isMobile ? '300px' : '400px';

  return (
    <div className="map-wrapper">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="map-container" style={{ height: mapHeight }}>
        <MapContainer 
          center={defaultCenter} 
          zoom={defaultZoom} 
          zoomControl={false}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={!isMobile}
          tap={isMobile}
          tapTolerance={20}
          touchZoom={true}
          dragging={true}
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
                <Popup className="custom-popup" maxWidth={isMobile ? 250 : 300}>
                  <div className="popup-content">
                    {profile.image_url ? (
                      <img
                        src={profile.image_url}
                        alt={profile.name}
                        className="popup-image"
                      />
                    ) : (
                      <div className="popup-avatar">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                      </div>
                    )}
                    <h3 className="popup-name">{profile.name}</h3>
                    <p className="popup-job">{profile.job}</p>
                    <p className="popup-location">📍 {profile.city}, {profile.country}</p>
                    <p className="popup-price">{profile.price}</p>
                    <button
                      onClick={() => window.navigateTo('profile', profile)}
                      className="popup-button"
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

      <style>{`
        .map-wrapper {
          width: 100%;
          font-family: "Outfit", sans-serif;
        }
        
        .map-container {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 2px solid #e2e8f0;
        }
        
        /* Leaflet Zoom Controls - Größer auf Mobile */
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        
        .leaflet-control-zoom a {
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 20px !important;
          background: white !important;
          color: #14B8A6 !important;
          border: none !important;
          font-weight: 700 !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: #14B8A6 !important;
          color: white !important;
        }
        
        /* Popup Styling */
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          width: 100% !important;
        }
        
        .popup-content {
          padding: 16px;
          text-align: center;
        }
        
        .popup-image {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 12px;
          border: 3px solid #14B8A6;
          display: block;
        }
        
        .popup-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          fontSize: 24px;
          font-weight: 700;
          color: white;
          margin: 0 auto 12px;
        }
        
        .popup-name {
          margin: 0 0 8px 0;
          fontSize: 16px;
          font-weight: 700;
          color: #1F2937;
        }
        
        .popup-job {
          margin: 0 0 4px 0;
          color: #14B8A6;
          font-weight: 600;
          fontSize: 14px;
        }
        
        .popup-location {
          margin: 0 0 8px 0;
          fontSize: 13px;
          color: #6B7280;
        }
        
        .popup-price {
          margin: 0 0 12px 0;
          fontSize: 16px;
          font-weight: 700;
          color: #F97316;
        }
        
        .popup-button {
          width: 100%;
          padding: 10px 16px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 8px;
          fontSize: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: "Outfit", sans-serif;
        }
        
        .popup-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(20,184,166,0.3);
        }
        
        /* Mobile Optimierungen */
        @media (max-width: 768px) {
          .map-container {
            border-radius: 8px;
          }
          
          .leaflet-control-zoom a {
            width: 44px !important;
            height: 44px !important;
            line-height: 44px !important;
            font-size: 24px !important;
          }
          
          .popup-content {
            padding: 14px;
          }
          
          .popup-image,
          .popup-avatar {
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
          
          .popup-name {
            font-size: 15px;
          }
          
          .popup-job {
            font-size: 13px;
          }
          
          .popup-location {
            font-size: 12px;
          }
          
          .popup-price {
            font-size: 15px;
          }
          
          .popup-button {
            padding: 12px;
            font-size: 15px;
            font-weight: 700;
          }
        }
      `}</style>
    </div>
  );
}

export default MapView;
