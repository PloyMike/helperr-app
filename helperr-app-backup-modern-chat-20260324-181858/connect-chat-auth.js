const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Import useAuth hinzufügen
content = content.replace(
  "import Footer from './Footer';",
  "import Footer from './Footer';\nimport { useAuth } from './AuthContext';"
);

// useAuth hook hinzufügen
content = content.replace(
  "function ProfilDetail({ profile, onBack }) {",
  "function ProfilDetail({ profile, onBack }) {\n  const { user } = useAuth();"
);

// Entferne localStorage States (brauchen wir nicht mehr)
content = content.replace(
  /const \[userName, setUserName\] = useState\(localStorage\.getItem\('helperr_user_name'\) \|\| ''\);[\s\S]*?const \[userEmail, setUserEmail\] = useState\(localStorage\.getItem\('helperr_user_email'\) \|\| ''\);/,
  ''
);

// Ersetze den Chat-Button onClick
content = content.replace(
  /onClick=\{\(\)=>\{[\s\S]*?setShowChat\(true\);[\s\S]*?\}\}\}/,
  `onClick={()=>{
                if(!user){
                  alert('Bitte logge dich ein um Nachrichten zu senden!');
                  window.navigateTo('login');
                }else{
                  setShowChat(true);
                }
              }}`
);

// Ersetze ChatModal Aufruf mit user Daten
content = content.replace(
  /{showChat&&<ChatModal profile=\{profile\} onClose=\{\(\)=>setShowChat\(false\)\} currentUserEmail=\{userEmail\} currentUserName=\{userName\}\/\>}/,
  `{showChat&&user&&<ChatModal profile={profile} onClose={()=>setShowChat(false)} currentUserEmail={user.email} currentUserName={user.user_metadata?.name || user.email}/>}`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Chat connected to Auth!');
