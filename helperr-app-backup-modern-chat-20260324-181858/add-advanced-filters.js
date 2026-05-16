const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Neue States nach searchQuery hinzufügen
content = content.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
  `const [searchQuery, setSearchQuery] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(200);
  const [selectedCity, setSelectedCity] = useState('');
  const [minRating, setMinRating] = useState(0);`
);

// Erweiterte Filterlogik
content = content.replace(
  /const filteredProfiles = profiles\.filter\(profile => \{[\s\S]*?return matchesSearch;[\s\S]*?\}\);/,
  `const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchQuery || 
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      profile.job?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      profile.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Preis-Filter (extrahiere Zahl aus Preis-String)
    const priceMatch = profile.price?.match(/\\d+/);
    const profilePrice = priceMatch ? parseInt(priceMatch[0]) : 0;
    const matchesPrice = profilePrice >= priceMin && profilePrice <= priceMax;
    
    // Stadt-Filter
    const matchesCity = !selectedCity || profile.city === selectedCity;
    
    // Rating-Filter
    const matchesRating = (profile.rating || 0) >= minRating;
    
    return matchesSearch && matchesPrice && matchesCity && matchesRating;
  });
  
  // Unique Städte für Dropdown
  const uniqueCities = [...new Set(profiles.map(p => p.city).filter(Boolean))].sort();`
);

// Filter-UI nach der Suchleiste einfügen (nach location-text)
const filterUI = `
          
          <div className="advanced-filters">
            <div className="filter-section">
              <label className="filter-label">Preis pro Stunde</label>
              <div className="price-inputs">
                <input type="number" value={priceMin} onChange={(e)=>setPriceMin(Number(e.target.value))} min="0" max="200" className="price-input" placeholder="Min €"/>
                <span className="price-separator">-</span>
                <input type="number" value={priceMax} onChange={(e)=>setPriceMax(Number(e.target.value))} min="0" max="200" className="price-input" placeholder="Max €"/>
              </div>
            </div>
            
            <div className="filter-section">
              <label className="filter-label">Stadt</label>
              <select value={selectedCity} onChange={(e)=>setSelectedCity(e.target.value)} className="city-select">
                <option value="">Alle Städte</option>
                {uniqueCities.map(city=><option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            
            <div className="filter-section">
              <label className="filter-label">Mindestbewertung</label>
              <div className="rating-buttons">
                {[0,3,4,4.5].map(rating=>(
                  <button key={rating} onClick={()=>setMinRating(rating)} className={\`rating-btn \${minRating===rating?'active':''}\`}>
                    {rating===0?'Alle':rating+'⭐'}
                  </button>
                ))}
              </div>
            </div>
            
            <button onClick={()=>{setPriceMin(0);setPriceMax(200);setSelectedCity('');setMinRating(0);}} className="reset-filters-btn">
              Filter zurücksetzen
            </button>
          </div>`;

content = content.replace(
  /(\{userLocation && <div className="location-text">📍 Dein Standort wurde erkannt<\/div>\})/,
  `$1${filterUI}`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Advanced filters added!');
