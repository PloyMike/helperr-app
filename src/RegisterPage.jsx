import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function RegisterPage() {
  const { user, signIn, signUp } = useAuth();
  const [showAuthForm, setShowAuthForm] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    city: '',
    country: '',
    price: '',
    bio: '',
    phone: '',
    email: '',
    whatsapp: '',
    languages: '',
    services: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setShowAuthForm(false);
      setFormData(prev => ({ ...prev, email: user.email, name: user.user_metadata?.name || '' }));
    }
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);

    if (isLogin) {
      const { error } = await signIn(authEmail, authPassword);
      if (error) {
        alert('Login fehlgeschlagen: ' + error.message);
      }
    } else {
      const { error } = await signUp(authEmail, authPassword, authName);
      if (error) {
        alert('Registrierung fehlgeschlagen: ' + error.message);
      } else {
        alert('✅ Account erstellt! Bitte bestätige deine Email und logge dich ein.');
      }
    }
    setAuthLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('profiles').insert([{
        ...formData,
        email: user.email,
        created_at: new Date().toISOString()
      }]);

      if (error) throw error;

      alert('✅ Profil erfolgreich erstellt! Du bist jetzt ein Anbieter!');
      window.navigateTo('home');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fehler: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px',background:'linear-gradient(135deg,rgba(20,184,166,0.1) 0%,rgba(13,148,136,0.1) 100%)'}}>
          <h1 style={{fontSize:48,fontWeight:800,textAlign:'center',marginBottom:12,fontFamily:'"Outfit",sans-serif',color:'#1F2937'}}>Werde Anbieter</h1>
          <p style={{fontSize:18,textAlign:'center',color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>Starte dein Business auf Helperr</p>
        </div>

        {showAuthForm ? (
          <div style={{maxWidth:500,margin:'40px auto',padding:'0 20px'}}>
            <div style={{backgroundColor:'white',borderRadius:20,padding:40,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
              <h2 style={{fontSize:24,fontWeight:700,marginBottom:24,color:'#1F2937',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>
                {isLogin ? 'Login zum Fortfahren' : 'Account erstellen'}
              </h2>

              <form onSubmit={handleAuth}>
                {!isLogin && (
                  <div style={{marginBottom:20}}>
                    <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Name</label>
                    <input required type="text" value={authName} onChange={(e)=>setAuthName(e.target.value)} placeholder="Dein Name" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
                  </div>
                )}

                <div style={{marginBottom:20}}>
                  <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Email</label>
                  <input required type="email" value={authEmail} onChange={(e)=>setAuthEmail(e.target.value)} placeholder="deine@email.com" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
                </div>

                <div style={{marginBottom:24}}>
                  <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:14,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Passwort</label>
                  <input required type="password" value={authPassword} onChange={(e)=>setAuthPassword(e.target.value)} placeholder="Mindestens 6 Zeichen" style={{width:'100%',padding:'12px 16px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
                </div>

                <button type="submit" disabled={authLoading} style={{width:'100%',padding:16,background:authLoading?'#CBD5E0':'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:authLoading?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',marginBottom:16}}>
                  {authLoading ? 'Lädt...' : (isLogin ? 'Einloggen' : 'Registrieren')}
                </button>

                <p style={{textAlign:'center',fontSize:14,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>
                  {isLogin ? 'Noch kein Account?' : 'Hast du schon einen Account?'}
                  <button type="button" onClick={()=>setIsLogin(!isLogin)} style={{marginLeft:8,color:'#14B8A6',fontWeight:600,background:'none',border:'none',cursor:'pointer',textDecoration:'underline',fontFamily:'"Outfit",sans-serif'}}>
                    {isLogin ? 'Registrieren' : 'Einloggen'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        ) : (
          <div style={{maxWidth:800,margin:'40px auto 80px',padding:'0 20px'}}>
            <form onSubmit={handleSubmit} style={{backgroundColor:'white',borderRadius:20,padding:40,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
              
              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Name *</label>
                <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Service / Beruf *</label>
                <input required type="text" value={formData.job} onChange={(e)=>setFormData({...formData,job:e.target.value})} placeholder="z.B. Elektriker, Maler, Reinigungskraft" style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:24}}>
                <div>
                  <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Stadt *</label>
                  <input required type="text" value={formData.city} onChange={(e)=>setFormData({...formData,city:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
                </div>
                <div>
                  <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Land *</label>
                  <input required type="text" value={formData.country} onChange={(e)=>setFormData({...formData,country:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
                </div>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Preis *</label>
                <input required type="text" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} placeholder="z.B. 50 Euro/Std" style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Über dich</label>
                <textarea rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData,bio:e.target.value})} placeholder="Beschreibe deine Erfahrung..." style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',resize:'vertical',boxSizing:'border-box'}}/>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Telefon</label>
                <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>WhatsApp</label>
                <input type="text" value={formData.whatsapp} onChange={(e)=>setFormData({...formData,whatsapp:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <div style={{marginBottom:24}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Sprachen</label>
                <input type="text" value={formData.languages} onChange={(e)=>setFormData({...formData,languages:e.target.value})} placeholder="Deutsch, Englisch" style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <div style={{marginBottom:32}}>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Services</label>
                <input type="text" value={formData.services} onChange={(e)=>setFormData({...formData,services:e.target.value})} placeholder="Installation, Reparatur, Beratung" style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
              </div>

              <button type="submit" disabled={loading} style={{width:'100%',padding:18,background:loading?'#CBD5E0':'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:18,fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 8px 25px rgba(20,184,166,0.4)'}}>
                {loading ? 'Erstellt Profil...' : 'Profil erstellen'}
              </button>
            </form>
          </div>
        )}
      </div>

      <Footer/>

      <style>{`
        @media (max-width: 768px) {
          h1 { font-size: 28px !important; }
          form { padding: 28px 20px !important; }
          input, textarea { font-size: 14px !important; padding: 12px 16px !important; }
          label { font-size: 14px !important; }
          button { padding: 14px !important; font-size: 15px !important; }
          div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
