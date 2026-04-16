const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyuatojpkluyidpefzub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dWF0b2pwa2x1eWlkcGVmenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTI1MzcsImV4cCI6MjA4Njk2ODUzN30.l9IOEIzM3Z6abB87ZOERYBcYNgFWIIRju0bUxyWrNgY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteAllExceptMikeAndJohn() {
  console.log('🗑️ Deleting all profiles except Mike Hirtz and John Wrick...\n');
  
  // Delete all profiles that are NOT these emails
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .not('email', 'in', '("hirtzmike@gmail.com","hirtzi@pt.lu")')
    .select();
  
  if (error) {
    console.log('❌ Error:', error);
    return;
  }
  
  console.log(`✅ Deleted ${data.length} profiles!`);
  console.log('Remaining profiles: Mike Hirtz and John Wrick\n');
  
  // Check what's left
  const { data: remaining } = await supabase
    .from('profiles')
    .select('name, email, job');
  
  console.log('📊 Remaining profiles:');
  remaining.forEach(p => {
    console.log(`  - ${p.name} (${p.email}) - Job: ${p.job}`);
  });
}

deleteAllExceptMikeAndJohn();
