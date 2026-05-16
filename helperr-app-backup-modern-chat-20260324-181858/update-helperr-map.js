const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add MapView import at top
if (!content.includes("import MapView")) {
  content = content.replace(
    "import { supabase } from './supabase';",
    "import { supabase } from './supabase';\nimport MapView from './MapView';"
  );
}

// Find the filters section and add Map before it
const filtersPattern = /(\/\* Filters \*\/[\s\S]*?<\/div>)/;
const match = content.match(filtersPattern);

if (match) {
  const mapSection = `
      {/* Map Section */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '30px 20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#1a202c' }}>
            🗺️ Helfer in deiner Nähe
          </h2>
          <MapView profiles={filteredProfiles} />
        </div>
      </div>

`;
  content = content.replace(match[0], mapSection + match[0]);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Map integrated into Helperr!');
} else {
  console.log('❌ Could not find filters section');
}
