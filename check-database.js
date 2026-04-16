const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyuatojpkluyidpefzub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dWF0b2pwa2x1eWlkcGVmenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTI1MzcsImV4cCI6MjA4Njk2ODUzN30.l9IOEIzM3Z6abB87ZOERYBcYNgFWIIRju0bUxyWrNgY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  console.log('🔍 Checking all profiles in database...\n');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*');
  
  if (error) {
    console.log('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Found ${data.length} profiles:\n`);
  data.forEach((profile, i) => {
    console.log(`Profile ${i+1}:`);
    console.log(`  Name: ${profile.name || 'N/A'}`);
    console.log(`  Email: ${profile.email || 'N/A'}`);
    console.log(`  Job: ${profile.job || 'N/A'}`);
    console.log(`  User ID: ${profile.user_id || 'N/A'}`);
    console.log(`  Has job field: ${!!profile.job ? 'YES ✅' : 'NO ❌'}`);
    console.log('');
  });
}

checkProfiles();
