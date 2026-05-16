const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Import supabase
content = content.replace(
  "import { useAuth } from './AuthContext';",
  "import { useAuth } from './AuthContext';\nimport { supabase } from './supabase';"
);

// Add unread messages state
content = content.replace(
  "const { user, signOut } = useAuth();",
  "const { user, signOut } = useAuth();\n  const [unreadCount, setUnreadCount] = useState(0);"
);

// Add useEffect to fetch unread count
content = content.replace(
  "const interval = setInterval(handleStorageChange, 1000);",
  `const interval = setInterval(handleStorageChange, 1000);

    // Fetch unread messages count
    const fetchUnreadCount = async () => {
      if (user) {
        const { data } = await supabase
          .from('messages')
          .select('id', { count: 'exact' })
          .eq('receiver_profile_id', user.id)
          .eq('read', false);
        setUnreadCount(data?.length || 0);
      } else {
        setUnreadCount(0);
      }
    };
    fetchUnreadCount();
    const msgInterval = setInterval(fetchUnreadCount, 5000);`
);

content = content.replace(
  "clearInterval(interval);",
  "clearInterval(interval);\n      clearInterval(msgInterval);"
);

// Add Messages button after Buchungen
content = content.replace(
  `</button>

          <button onClick={()=>window.navigateTo('favorites')}`,
  `</button>

          <button onClick={()=>window.navigateTo('messages')} style={{position:'relative',background:'none',border:'none',color:'white',fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.2s'}} onMouseOver={(e)=>e.target.style.opacity='0.8'} onMouseOut={(e)=>e.target.style.opacity='1'}>
            Nachrichten
            {unreadCount>0&&<span style={{position:'absolute',top:-8,right:-12,backgroundColor:'#F97316',color:'white',borderRadius:'50%',width:20,height:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700}}>{unreadCount}</span>}
          </button>

          <button onClick={()=>window.navigateTo('favorites')}`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Header updated with Messages!');
