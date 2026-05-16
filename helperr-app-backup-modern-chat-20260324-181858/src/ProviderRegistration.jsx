import React, { useState } from 'react';
import { supabase } from './supabase';

function ProviderRegistration({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '', job: '', city: '', country: '', price: '', bio: '', phone: '', email: '', whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').insert([{ ...formData, available: true, verified: false, id_status: 'pending', rating: 0, review_count: 0, total_bookings: 0 }]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => { onClose(); window.location.reload(); }, 2000);
    } catch (error) {
      alert('Fehler: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = {width:'100%',padding:14,border:'1px solid #e5e7eb',borderRadius:8,fontSize:16,fontFamily:'"Outfit",sans-serif',boxSizing:'border-box',backgroundColor:'white',outline:'none'};
  const labelStyle = {display:'block',marginBottom:12,fontWeight:600,fontSize:15,color:'white',fontFamily:'"Outfit",sans-serif'};

  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:20}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{backgroundColor:'transparent',padding:'80px 30px 30px',maxWidth:600,width:'100%',maxHeight:'90vh',overflowY:'auto',position:'relative',fontFamily:'"Outfit",sans-serif'}}>
        <button onClick={onClose} style={{position:'absolute',top:20,right:20,background:'white',border:'none',fontSize:32,cursor:'pointer',color:'#1F2937',width:50,height:50,borderRadius:'50%',boxShadow:'0 4px 15px rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>×</button>

        {success ? (
          <div style={{textAlign:'center',padding:60,color:'white'}}>
            <h2 style={{fontSize:28,fontWeight:800,marginBottom:20}}>Erfolgreich registriert!</h2>
            <p style={{fontSize:16}}>Dein Profil wird in Kürze geprüft</p>
          </div>
        ) : (
          <>
            <h2 style={{color:'white',fontSize:28,fontWeight:800,marginBottom:12,fontFamily:'"Outfit",sans-serif'}}>Als Anbieter registrieren</h2>
            <p style={{color:'white',fontSize:16,marginBottom:50,fontFamily:'"Outfit",sans-serif'}}>Fülle das Formular aus um dein Profil zu erstellen</p>

            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} style={inputStyle} placeholder="Dein vollständiger Name"/>
              </div>

              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>Beruf / Service *</label>
                <input type="text" name="job" required value={formData.job} onChange={(e)=>setFormData({...formData,job:e.target.value})} style={inputStyle} placeholder="z.B. Putzfrau, Babysitter, Koch"/>
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:28}}>
                <div style={{textAlign:'left'}}>
                  <label style={labelStyle}>Stadt *</label>
                  <input type="text" name="city" required value={formData.city} onChange={(e)=>setFormData({...formData,city:e.target.value})} style={inputStyle} placeholder="Berlin"/>
                </div>
                <div style={{textAlign:'left'}}>
                  <label style={labelStyle}>Land *</label>
                  <input type="text" name="country" required value={formData.country} onChange={(e)=>setFormData({...formData,country:e.target.value})} style={inputStyle} placeholder="Deutschland"/>
                </div>
              </div>

              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>Preis *</label>
                <input type="text" name="price" required value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} style={inputStyle} placeholder="20 Euro/Std"/>
              </div>

              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>Über mich</label>
                <textarea name="bio" rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData,bio:e.target.value})} style={{...inputStyle,resize:'vertical'}} placeholder="Beschreibe deine Erfahrung"/>
              </div>

              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>Telefon</label>
                <input type="tel" name="phone" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} style={inputStyle} placeholder="+49 123 456789"/>
              </div>

              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>E-Mail</label>
                <input type="email" name="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} style={inputStyle} placeholder="deine@email.com"/>
              </div>

              <div style={{marginBottom:28,textAlign:'left'}}>
                <label style={labelStyle}>WhatsApp</label>
                <input type="text" name="whatsapp" value={formData.whatsapp} onChange={(e)=>setFormData({...formData,whatsapp:e.target.value})} style={inputStyle} placeholder="+49 123 456789"/>
              </div>

              <button type="submit" disabled={loading} style={{width:'100%',padding:16,backgroundColor:loading?'#93c5fd':'#1d4ed8',color:'white',border:'none',borderRadius:8,fontSize:18,fontWeight:700,cursor:loading?'not-allowed':'pointer',fontFamily:'"Outfit",sans-serif',marginTop:10}}>
                {loading ? 'Wird registriert...' : 'Jetzt registrieren'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ProviderRegistration;
