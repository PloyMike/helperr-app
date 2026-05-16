const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// 1. Add supabase import if not there
if (!content.includes("import { supabase }")) {
  content = content.replace(
    `import { useState, useEffect, useRef, useCallback } from "react";`,
    `import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from './supabase';`
  );
}

// 2. Find where profiles state might be and add fetch
// Look for useState declarations
const lines = content.split('\n');
let insertIndex = -1;
let foundFunction = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const Helperr') || lines[i].includes('function Helperr')) {
    foundFunction = true;
  }
  if (foundFunction && lines[i].trim() === '') {
    insertIndex = i;
    break;
  }
}

if (insertIndex > 0) {
  const fetchCode = `
  // Fetch profiles from Supabase
  const [profiles, setProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) setProfiles(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);
`;
  
  lines.splice(insertIndex, 0, fetchCode);
  content = lines.join('\n');
  
  fs.writeFileSync('src/Helperr.jsx', content);
  console.log('✅ Supabase added to old design!');
} else {
  console.log('❌ Could not find insertion point');
}
