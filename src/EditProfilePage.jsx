import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';
import Footer from './Footer';

function EditProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (error) {
        console.log('Kein Profil gefunden');
        setLoading(false);
        return;
      }

      setProfile(data);
      setFormData({
        name: data.name || '',
        job: data.job || '',
        city: data.city || '',
        country: data.country || '',
        price: data.price || '',
        bio: data.bio || '',
        phone: data.phone || '',
        email: data.email || '',
        whatsapp: data.whatsapp || '',
        languages: data.languages || '',
        services: data.services || ''
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', profile.id);

      if (error) throw error;

      alert('✅ Profil erfolgreich aktualisiert!');
      fetchProfile();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fehler beim Speichern: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:20,color:'#1F2937'}}>Login erforderlich</h2>
            <p style={{fontSize:15,color:'#6B7280',marginBottom:24}}>Bitte logge dich ein um dein Profil zu bearbeiten.</p>
            <button onClick={()=>window.navigateTo('login')} style={{width:'100%',padding:16,background:'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer'}}>
              Zum Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',backgroundColor:'#F9FAFB'}}>
        <p style={{fontSize:20,fontWeight:600,color:'#14B8A6',fontFamily:'"Outfit",sans-serif'}}>Lädt Profil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <Header/>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'90px 20px 40px'}}>
          <div style={{background:'white',padding:40,borderRadius:20,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',maxWidth:400,width:'100%',fontFamily:'"Outfit",sans-serif',textAlign:'center'}}>
            <div style={{fontSize:64,marginBottom:20}}>🤷</div>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:12,color:'#1F2937'}}>Kein Profil gefunden</h2>
            <p style={{fontSize:15,color:'#6B7280',marginBottom:24}}>Du hast noch kein Anbieter-Profil erstellt.</p>
            <button onClick={()=>window.navigateTo('register')} style={{width:'100%',padding:16,background:'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',color:'white',border:'none',borderRadius:12,fontSize:16,fontWeight:700,cursor:'pointer'}}>
              Profil erstellen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}/>
          <div style={{maxWidth:800,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2,color:'#1F2937'}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>Profil bearbeiten</h1>
            <p style={{fontSize:18,opacity:0.95,fontFamily:'"Outfit",sans-serif',fontWeight:400}}>Aktualisiere deine Informationen</p>
          </div>
        </div>

        <div style={{maxWidth:800,margin:'-40px auto 80px',padding:'0 20px'}}>
          <form onSubmit={handleSubmit} style={{backgroundColor:'white',borderRadius:20,padding:40,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
            
            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Name *</label>
              <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Beruf / Service *</label>
              <input required type="text" value={formData.job} onChange={(e)=>setFormData({...formData,job:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
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
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Über mich</label>
              <textarea rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData,bio:e.target.value})} placeholder="Beschreibe deine Erfahrung und Qualifikationen..." style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',resize:'vertical',boxSizing:'border-box'}}/>
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
              <input type="text" value={formData.languages} onChange={(e)=>setFormData({...formData,languages:e.target.value})} placeholder="Deutsch, Englisch, Französisch" style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
            </div>

            <div style={{marginBottom:32}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Services</label>
              <input type="text" value={formData.services} onChange={(e)=>setFormData({...formData,services:e.target.value})} placeholder="Reparatur, Installation, Beratung" style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',boxSizing:'border-box'}}/>
            </div>

            <button type="submit" disabled={saving} style={{width:'100%',padding:18,background:saving?'#CBD5E0':'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',color:'white',border:'none',borderRadius:16,fontSize:18,fontWeight:700,cursor:saving?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 8px 25px rgba(20,184,166,0.4)',transition:'all 0.3s'}}>
              {saving ? 'Speichere...' : 'Profil speichern'}
            </button>
          </form>
        </div>
      </div>

      <Footer/>
      <style>{`
        @media (max-width: 768px) {
          /* Hero Section kleiner */
          div[style*="padding: 60px 20px"] {
            padding: 40px 16px !important;
          }
          h1 {
            font-size: 28px !important;
            margin-bottom: 8px !important;
          }
          div[style*="fontSize:18"] {
            font-size: 15px !important;
          }
          
          /* Form Container - KEIN negatives Margin auf Mobile */
          div[style*="margin: -40px auto"] {
            margin: 20px auto 60px !important;
            padding: 0 16px !important;
          }
          
          /* Form selbst */
          form {
            padding: 28px 20px !important;
          }
          
          /* Inputs & Labels */
          input, textarea {
            font-size: 14px !important;
            padding: 12px 16px !important;
          }
          label {
            font-size: 14px !important;
          }
          
          /* Submit Button */
          button[type="submit"] {
            padding: 16px !important;
            font-size: 16px !important;
          }
          
          /* Grid zu Single Column */
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      

    </div>
  );
}

export default EditProfilePage;
