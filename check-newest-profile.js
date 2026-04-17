const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jyuatojpkluyidpefzub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5dWF0b2pwa2x1eWlkcGVmenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzOTI1MzcsImV4cCI6MjA4Njk2ODUzN30.l9IOEIzM3Z6abB87ZOERYBcYNgFWIIRju0bUxyWrNgY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNewest() {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  console.log('📊 Newest 5 profiles:\n');
  data.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} (${p.email})`);
    console.log(`   Job: ${p.job || 'N/A'}`);
    console.log(`   User ID: ${p.user_id || 'N/A'}`);
    console.log(`   Created: ${p.created_at}`);
    console.log('');
  });
}

checkNewest();
