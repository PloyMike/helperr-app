const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Entferne Filter aus dem Hero (löschen)
content = content.replace(
  /<div className="advanced-filters">[\s\S]*?<\/div>\s*<\/div>/,
  '</div>'
);

// Füge Filter NACH dem Hero ein, VOR der "X Helfer gefunden" Zeile
content = content.replace(
  /(<\/div>\s*<div style=\{\{maxWidth:1200,margin:'20px auto')/,
  `</div>
      
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
          
          <button onClick={()=>{setPriceMin(0);setPriceMax(200);setSelectedCity('');setMinRating(0);}} className="reset-filters-btn">
            Filter zurücksetzen
          </button>
        </div>
      </div>
      
      $1`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Filters repositioned outside hero!');
