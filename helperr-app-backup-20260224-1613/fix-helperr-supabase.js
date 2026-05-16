const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// 1. Add supabase import after the first import
content = content.replace(
  `import { useState, useEffect, useRef, useCallback } from "react";`,
  `import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from './supabase';`
);

// 2. Find the Helperr function start and add fetch logic
// Look for "const Helperr = " or "function Helperr"
const functionPattern = /(const Helperr = .*?\{|function Helperr.*?\{)/;
const match = content.match(functionPattern);

if (match) {
  // Add fetchProfiles function right after function declaration
  const insertion = `
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);
`;
  
  content = content.replace(match[0], match[0] + insertion);
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Supabase fetch added to Helperr.jsx!');
} else {
  console.log('❌ Could not find function declaration');
}
