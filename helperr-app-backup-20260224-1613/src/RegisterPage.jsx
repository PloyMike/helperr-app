import React, { useState } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import Footer from './Footer';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job: '',
    city: '',
    country: '',
    price: '',
    bio: '',
    languages: '',
    services: '',
    available: true,
    verified: false
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('profiles').insert([formData]);
      if (error) throw error;

      alert('✅ Profil erfolgreich erstellt!');
      window.navigateTo('home');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Fehler beim Erstellen: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div style={{paddingTop:70}}>
        <div style={{position:'relative',overflow:'hidden',padding:'60px 20px',color:'white'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.12,zIndex:0}}/>
          <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(20,184,166,0.92) 0%,rgba(13,148,136,0.95) 100%)',zIndex:1}}/>
          <div style={{maxWidth:800,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2}}>
            <h1 style={{fontSize:48,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>🚀 Anbieter werden</h1>
            <p style={{fontSize:18,opacity:0.95,fontFamily:'"Outfit",sans-serif',fontWeight:400}}>Erstelle dein Profil und erreiche neue Kunden</p>
          </div>
        </div>

        <div style={{maxWidth:800,margin:'-40px auto 80px',padding:'0 20px'}}>
          <form onSubmit={handleSubmit} style={{backgroundColor:'white',borderRadius:20,padding:40,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
            
            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Name *</label>
              <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}} onFocus={(e)=>{e.target.style.borderColor='#14B8A6';e.target.style.boxShadow='0 0 0 3px rgba(20,184,166,0.1)';}} onBlur={(e)=>{e.target.style.borderColor='#E5E7EB';e.target.style.boxShadow='none';}}/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:24}}>
              <div>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Email *</label>
                <input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
              </div>
              <div>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Telefon</label>
                <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
              </div>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Beruf / Service *</label>
              <input required type="text" placeholder="z.B. Klempner, Gärtner, Nachhilfelehrer" value={formData.job} onChange={(e)=>setFormData({...formData,job:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginBottom:24}}>
              <div>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Stadt *</label>
                <input required type="text" value={formData.city} onChange={(e)=>setFormData({...formData,city:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
              </div>
              <div>
                <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Land *</label>
                <input required type="text" value={formData.country} onChange={(e)=>setFormData({...formData,country:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
              </div>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Preis *</label>
              <input required type="text" placeholder="z.B. 50€/Std" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Über dich</label>
              <textarea rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData,bio:e.target.value})} placeholder="Beschreibe deine Erfahrung und Qualifikationen..." style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif',resize:'vertical'}}/>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Sprachen</label>
              <input type="text" placeholder="Deutsch, Englisch, Französisch" value={formData.languages} onChange={(e)=>setFormData({...formData,languages:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
            </div>

            <div style={{marginBottom:32}}>
              <label style={{display:'block',marginBottom:8,fontWeight:600,fontSize:15,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Services</label>
              <input type="text" placeholder="Reparatur, Installation, Beratung" value={formData.services} onChange={(e)=>setFormData({...formData,services:e.target.value})} style={{width:'100%',padding:'14px 18px',border:'1px solid #E5E7EB',borderRadius:12,fontSize:15,outline:'none',fontFamily:'"Outfit",sans-serif'}}/>
            </div>

            <button type="submit" disabled={submitting} style={{width:'100%',padding:'18px',background:submitting?'#CBD5E0':'linear-gradient(135deg,#F97316 0%,#EA580C 100%)',color:'white',border:'none',borderRadius:16,fontSize:18,fontWeight:700,cursor:submitting?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',boxShadow:'0 8px 25px rgba(249,115,22,0.4)',transition:'all 0.3s'}}>
              {submitting ? '⏳ Wird erstellt...' : '🚀 Profil erstellen'}
            </button>
          </form>
        </div>
      </div>

      <Footer/>
    </div>
  );
}

export default RegisterPage;
