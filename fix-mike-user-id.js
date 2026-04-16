const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyuatojpkluyidpefzub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dWF0b2pwa2x1eWlkcGVmenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTI1MzcsImV4cCI6MjA4Njk2ODUzN30.l9IOEIzM3Z6abB87ZOERYBcYNgFWIIRju0bUxyWrNgY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixMikeProfile() {
  console.log('🔧 Fixing Mike Hirtz profile user_id...\n');
  
  // Update Mike Dee profile with correct user_id
  const { data, error } = await supabase
    .from('profiles')
    .update({ user_id: '0d0fdb5b-3ddd-415a-baba-6b09cc04f378' })
    .eq('email', 'hirtzmike@gmail.com')
    .eq('name', 'Mike Dee')
    .select();
  
  if (error) {
    console.log('❌ Error:', error);
    return;
  }
  
  console.log('✅ Profile updated!');
  console.log('Updated:', data);
}

fixMikeProfile();
