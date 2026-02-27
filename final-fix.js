const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx.backup', 'utf8');

// 1. Add supabase import
if (!content.includes('import { supabase }')) {
  content = content.replace(
    `import { useState, useEffect, useRef, useCallback } from "react";`,
    `import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from './supabase';`
  );
}

// 2. Find the hardcoded profiles array (around line 130-200)
// Replace it with dynamic fetch
const profilesPattern = /const\s+PROFILES\s*=\s*\[[\s\S]*?\];|const\s+profiles\s*=\s*\[[\s\S]*?\];/;

if (content.match(profilesPattern)) {
  // Replace with empty array - we'll use state
  content = content.replace(profilesPattern, '// Profiles loaded from Supabase');
}

// 3. Find the Helperr function and add fetch logic at the start
const helperrFunctionPattern = /(const Helperr = \(\) => \{|function Helperr\(\) \{)/;
const match = content.match(helperrFunctionPattern);

if (match) {
  const fetchCode = `
  // Load profiles from Supabase
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map Supabase data to match old structure
        const mappedProfiles = (data || []).map(p => ({
          id: p.id,
          name: p.name || 'Unbekannt',
          city: p.city || '',
          country: p.country || '',
          flag: '', // Will be generated based on country
          job: p.job || 'Keine Angabe',
          tags: p.job ? [p.job.toLowerCase()] : [],
          rating: p.rating || 0,
          reviewCount: p.review_count || 0,
          price: p.price || 'Preis auf Anfrage',
          available: p.available !== false,
          verified: p.verified || false,
          idStatus: p.id_status || 'pending',
          bio: p.bio || '',
          social: {
            whatsapp: p.whatsapp || '',
            phone: p.phone || '',
            email: p.email || ''
          },
          photos: [],
          reviews: []
        }));
        
        setProfiles(mappedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };
    
    fetchProfiles();
  }, []);
`;
  
  content = content.replace(match[0], match[0] + fetchCode);
}

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Old design restored with Supabase!');
