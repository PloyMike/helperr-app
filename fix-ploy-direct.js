const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyuatojpkluyidpefzub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dWF0b2pwa2x1eWlkcGVmenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTI1MzcsImV4cCI6MjA4Njk2ODUzN30.l9IOEIzM3Z6abB87ZOERYBcYNgFWIIRju0bUxyWrNgY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPloy() {
  console.log('🔧 Updating ploy.tibor profile with correct user_id...\n');
  
  // Update ALL profiles with this email to have the correct user_id
  const { data, error } = await supabase
    .from('profiles')
    .update({ user_id: 'cd75dd60-249f-4e0a-bdb4-227bb045badc' })
    .eq('email', 'ploy.tibor@gmail.com')
    .select();
  
  if (error) {
    console.log('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Updated ${data.length} profile(s)!`);
  data.forEach(p => {
    console.log(`  - ${p.name} (${p.email})`);
    console.log(`    Job: ${p.job}`);
    console.log(`    User ID: ${p.user_id}`);
  });
}

fixPloy();
