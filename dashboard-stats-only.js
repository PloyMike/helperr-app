const fs = require('fs');
let content = fs.readFileSync('src/ProviderDashboard.jsx', 'utf8');

// Entferne Filter-Section
content = content.replace(
  /\/\* FILTER \*\/[\s\S]*?<\/div>[\s\S]*?<\/div>/,
  ''
);

// Entferne Buchungen-Liste komplett - ersetze mit Link zu Buchungen
content = content.replace(
  /\/\* BUCHUNGEN \*\/[\s\S]*?<\/div>\s*\)\s*\}\s*<\/div>/,
  `{/* QUICK ACTION */}
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 4px 20px rgba(0,0,0,0.08)',textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:20}}>📋</div>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Buchungen verwalten</h2>
            <p style={{fontSize:16,color:'#6B7280',marginBottom:24,fontFamily:'"Outfit",sans-serif'}}>Sieh alle deine Buchungen an und verwalte sie.</p>
            <button onClick={()=>window.navigateTo('bookings')} style={{padding:'16px 32px',background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:16,fontWeight:700,cursor:'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 4px 15px rgba(20,184,166,0.3)'}}>
              Zu meinen Buchungen →
            </button>
          </div>
        </div>`
);

// Entferne statusFilter State
content = content.replace(
  /const \[statusFilter, setStatusFilter\] = useState\('all'\);\n?/,
  ''
);

// Entferne filteredBookings
content = content.replace(
  /const filteredBookings = bookings\.filter\(b => statusFilter === 'all' \|\| b\.status === statusFilter\);\n?/,
  ''
);

fs.writeFileSync('src/ProviderDashboard.jsx', content);
console.log('✅ Dashboard now shows only stats!');
