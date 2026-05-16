import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);
    
    if (error) {
      alert('Login fehlgeschlagen: ' + error.message);
    } else {
      window.navigateTo('home');
    }
    setLoading(false);
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}></div>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}></div>
          <div style={{maxWidth:500,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2,color:'#1F2937'}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>🔐 Login</h1>
            <p style={{fontSize:18,fontFamily:'"Outfit",sans-serif',fontWeight:400}}>Willkommen zurück!</p>
          </div>
        </div>

        <div style={{maxWidth:500,margin:'-40px auto 80px',padding:'0 20px'}}>
          <form onSubmit={handleSubmit} style={{backgroundColor:'white',borderRadius:20,padding:40,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
            
            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Email *</label>
              <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
            </div>

            <div style={{marginBottom:32}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Passwort *</label>
              <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
            </div>

            <button type="submit" disabled={loading} style={{width:'100%',padding:'18px',background:loading?'#CBD5E0':'#1F2937',color:'white',border:'none',borderRadius:16,fontSize:18,fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',marginBottom:16}}>
              {loading ? '⏳ Lädt...' : 'Einloggen'}
            </button>

            <p style={{textAlign:'center',fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>
              Noch kein Account? <button type="button" onClick={()=>window.navigateTo('signup')} style={{background:'none',border:'none',color:'#14B8A6',fontWeight:600,cursor:'pointer',textDecoration:'underline'}}>Registrieren</button>
            </p>
          </form>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default LoginPage;
