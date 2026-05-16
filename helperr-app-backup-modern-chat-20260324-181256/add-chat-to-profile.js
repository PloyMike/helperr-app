const fs = require('fs');
let content = fs.readFileSync('src/ProfilDetail.jsx', 'utf8');

// Import ChatModal hinzufügen
content = content.replace(
  "import Footer from './Footer';",
  "import Footer from './Footer';\nimport ChatModal from './ChatModal';"
);

// State für Chat hinzufügen
content = content.replace(
  "const [showBooking, setShowBooking] = useState(false);",
  "const [showBooking, setShowBooking] = useState(false);\n  const [showChat, setShowChat] = useState(false);\n  const [userName, setUserName] = useState(localStorage.getItem('helperr_user_name') || '');\n  const [userEmail, setUserEmail] = useState(localStorage.getItem('helperr_user_email') || '');"
);

// Chat-Button nach Buchungs-Button hinzufügen
content = content.replace(
  '<p style={{fontSize:13,color:\'#9CA3AF\',marginTop:16,textAlign:\'center\',fontFamily:\'"Outfit",sans-serif\'}}>💬 Sichere Zahlung über die Plattform</p>',
  `<p style={{fontSize:13,color:'#9CA3AF',marginTop:16,textAlign:'center',fontFamily:'"Outfit",sans-serif'}}>💬 Sichere Zahlung über die Plattform</p>
            </div>

            <div style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',border:'1px solid #E5E7EB'}}>
              <button onClick={()=>{
                if(!userName||!userEmail){
                  const name=prompt('Dein Name:');
                  const email=prompt('Deine Email:');
                  if(name&&email){
                    localStorage.setItem('helperr_user_name',name);
                    localStorage.setItem('helperr_user_email',email);
                    setUserName(name);
                    setUserEmail(email);
                    setShowChat(true);
                  }
                }else{
                  setShowChat(true);
                }
              }} style={{width:'100%',padding:'16px',background:'transparent',color:'#14B8A6',border:'2px solid #14B8A6',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.background='#14B8A6';e.target.style.color='white';}} onMouseOut={(e)=>{e.target.style.background='transparent';e.target.style.color='#14B8A6';}}>
                💬 Nachricht senden
              </button>`
);

// ChatModal vor Footer hinzufügen
content = content.replace(
  '<Footer/>',
  `<Footer/>\n\n      {showChat&&<ChatModal profile={profile} onClose={()=>setShowChat(false)} currentUserEmail={userEmail} currentUserName={userName}/>}`
);

fs.writeFileSync('src/ProfilDetail.jsx', content);
console.log('✅ Chat button added to ProfilDetail!');
