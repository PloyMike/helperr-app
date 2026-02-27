const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Add supabase import
if (!content.includes('import { supabase }')) {
  content = content.replace(
    `import { useState, useEffect, useRef, useCallback } from "react";`,
    `import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from './supabase';`
  );
}

// Find const Helperr and add useEffect AFTER the function starts
const pattern = /(const Helperr = \(\) => \{)/;
if (content.match(pattern)) {
  content = content.replace(pattern, `$1
  
  // Override PROFILES with Supabase data
  const [PROFILES, setPROFILES] = useState([]);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (data) {
        const mapped = data.map(p => ({
          id: p.id, name: p.name || 'Unbekannt', city: p.city || '', country: p.country || '',
          flag: '', job: p.job || 'Keine Angabe', tags: p.job ? [p.job.toLowerCase()] : [],
          rating: p.rating || 0, reviewCount: p.review_count || 0, price: p.price || 'Preis auf Anfrage',
          available: p.available !== false, verified: p.verified || false, idStatus: p.id_status || 'pending',
          bio: p.bio || '', social: { whatsapp: p.whatsapp || '', phone: p.phone || '', email: p.email || '' },
          photos: [], reviews: []
        }));
        setPROFILES(mapped);
      }
    };
    fetchProfiles();
  }, []);`);
}

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Supabase override added!');
