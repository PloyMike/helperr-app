const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add geolocation fetch in useEffect
content = content.replace(
  /useEffect\(\(\) => \{\s+fetchProfiles\(\);\s+\}, \[\]\);/,
  `useEffect(() => {
    fetchProfiles();
    
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location error:', error);
          setLocationError(true);
        }
      );
    }
  }, []);`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Geolocation restored!');
