const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// 1. Filter-Wrapper ENTFERNEN von oben
content = content.replace(
  /{\/\* ERWEITERTE FILTER \*\/}[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  ''
);

// 2. Filter VOR der Map einfügen (vor <div id="map-section">)
const filterSection = `
      {/* ERWEITERTE FILTER */}
      <div className="filters-wrapper">
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
          
          <button onClick={resetFilters} className="reset-filters-btn">
            Filter zurücksetzen
          </button>
        </div>
      </div>
`;

content = content.replace(
  /(<div id="map-section")/,
  `${filterSection}\n      $1`
);

// 3. Grid CSS zu Horizontal Scroll ändern
content = content.replace(
  /\.profile-grid \{[\s\S]*?grid-template-columns: repeat\(auto-fill, minmax\(320px, 1fr\)\);[\s\S]*?gap: 32px;[\s\S]*?\}/,
  `.profile-grid {
          max-width: 1200px;
          margin: 0 auto 40px;
          padding: 0 20px;
          display: flex;
          overflow-x: auto;
          gap: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .profile-grid::-webkit-scrollbar {
          display: none;
        }`
);

// 4. Profile-Card min-width für horizontal scroll
content = content.replace(
  /\.profile-card \{/,
  `.profile-card {
          min-width: 320px;
          flex-shrink: 0;
          scroll-snap-align: start;`
);

// 5. Mobile Grid zurück zu horizontal
content = content.replace(
  /\.profile-grid \{[\s\S]*?grid-template-columns: 1fr;/,
  `.profile-grid {
            padding: 0 16px;`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Filters moved to map + horizontal scroll enabled!');
