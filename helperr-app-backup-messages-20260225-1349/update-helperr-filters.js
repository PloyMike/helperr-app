const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add import
if (!content.includes("import AdvancedFilters")) {
  content = content.replace(
    "import MapView from './MapView';",
    "import MapView from './MapView';\nimport AdvancedFilters from './AdvancedFilters';"
  );
}

// Add filter state
if (!content.includes('const [filters, setFilters]')) {
  content = content.replace(
    'const [favorites, setFavorites] = useState([]);',
    `const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 200 },
    minRating: 0,
    availableOnly: false
  });`
  );
}

// Add reset filters function
if (!content.includes('const resetFilters = ()')) {
  content = content.replace(
    'const getBadge = (profile) => {',
    `const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 200 },
      minRating: 0,
      availableOnly: false
    });
  };

  const getBadge = (profile) => {`
  );
}

// Update filteredProfiles to include new filters
const oldFilterPattern = /const filteredProfiles = profiles\.filter\(profile => \{[\s\S]*?return matchesSearch && matchesCity;[\s\S]*?\}\);/;

const newFilterCode = `const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchQuery || 
      profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.job?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === 'all' || profile.city === selectedCity;
    
    // Price filter
    const priceNum = parseInt((profile.price || '0').match(/\\d+/)?.[0] || '0');
    const matchesPrice = priceNum >= filters.priceRange.min && priceNum <= filters.priceRange.max;
    
    // Rating filter
    const matchesRating = (profile.rating || 0) >= filters.minRating;
    
    // Availability filter
    const matchesAvailable = !filters.availableOnly || profile.available;
    
    return matchesSearch && matchesCity && matchesPrice && matchesRating && matchesAvailable;
  });`;

content = content.replace(oldFilterPattern, newFilterCode);

// Add AdvancedFilters component before the results count
const resultsCountPattern = /(\/\* Results Count \*\/|<div style=\{\{ maxWidth: 1200, margin: '20px auto', padding: '0 20px', color: '#4a5568', fontWeight: 600 \}\}>)/;

const filtersComponent = `      {/* Advanced Filters */}
      <div style={{ maxWidth: 1200, margin: '20px auto', padding: '0 20px' }}>
        <AdvancedFilters filters={filters} setFilters={setFilters} onReset={resetFilters} />
      </div>

      $1`;

content = content.replace(resultsCountPattern, filtersComponent);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Filters integrated into Helperr.jsx!');
