import React, { useState } from 'react';
import { supabase } from './supabase';
import Header from './Header';
import Footer from './Footer';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', job: '', city: '', country: '', price: '', bio: '', languages: '', services: '', available: true, verified: false
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from('profiles').insert([formData]);
      if (error) throw error;
      alert('Profil erfolgreich erstellt!');
      window.navigateTo('home');
    } catch (error) {
      alert('Fehler: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="register-wrapper">
        <div className="hero-section">
          <div className="hero-bg"></div>
          <div className="hero-gradient"></div>
          <div className="hero-content">
            <h1 className="hero-title">Anbieter werden</h1>
            <p className="hero-subtitle">Erstelle dein Profil und erreiche neue Kunden</p>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="register-form">
            
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input required type="text" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} className="form-input"/>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input required type="email" value={formData.email} onChange={(e)=>setFormData({...formData,email:e.target.value})} className="form-input"/>
              </div>
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData,phone:e.target.value})} className="form-input"/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Beruf / Service *</label>
              <input required type="text" placeholder="z.B. Klempner, Gärtner, Nachhilfelehrer" value={formData.job} onChange={(e)=>setFormData({...formData,job:e.target.value})} className="form-input"/>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Stadt *</label>
                <input required type="text" value={formData.city} onChange={(e)=>setFormData({...formData,city:e.target.value})} className="form-input"/>
              </div>
              <div className="form-group">
                <label className="form-label">Land *</label>
                <input required type="text" value={formData.country} onChange={(e)=>setFormData({...formData,country:e.target.value})} className="form-input"/>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preis *</label>
              <input required type="text" placeholder="z.B. 50 Euro/Std" value={formData.price} onChange={(e)=>setFormData({...formData,price:e.target.value})} className="form-input"/>
            </div>

            <div className="form-group">
              <label className="form-label">Über dich</label>
              <textarea rows={4} value={formData.bio} onChange={(e)=>setFormData({...formData,bio:e.target.value})} placeholder="Beschreibe deine Erfahrung und Qualifikationen..." className="form-textarea"/>
            </div>

            <div className="form-group">
              <label className="form-label">Sprachen</label>
              <input type="text" placeholder="Deutsch, Englisch, Französisch" value={formData.languages} onChange={(e)=>setFormData({...formData,languages:e.target.value})} className="form-input"/>
            </div>

            <div className="form-group">
              <label className="form-label">Services</label>
              <input type="text" placeholder="Reparatur, Installation, Beratung" value={formData.services} onChange={(e)=>setFormData({...formData,services:e.target.value})} className="form-input"/>
            </div>

            <button type="submit" disabled={submitting} className={`submit-btn ${submitting?'loading':''}`}>
              {submitting ? 'Wird erstellt...' : 'Profil erstellen'}
            </button>
          </form>
        </div>
      </div>

      <Footer/>

      <style>{`
        .register-container { min-height: 100vh; background-color: #F9FAFB; }
        .register-wrapper { padding-top: 70px; }
        .hero-section { position: relative; overflow: hidden; padding: 60px 20px; }
        .hero-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url(https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1600&q=80); background-size: cover; background-position: center; opacity: 0.7; z-index: 0; }
        .hero-gradient { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.9) 100%); z-index: 1; }
        .hero-content { max-width: 800px; margin: 0 auto; text-align: center; position: relative; z-index: 2; color: #1F2937; }
        .hero-title { font-size: 48px; font-weight: 800; margin-bottom: 12px; font-family: "Outfit", sans-serif; letter-spacing: -1px; }
        .hero-subtitle { font-size: 18px; opacity: 0.95; font-family: "Outfit", sans-serif; font-weight: 400; }
        .form-container { max-width: 800px; margin: -10px auto 80px; padding: 0 20px; }
        .register-form { background-color: transparent; border-radius: 0; padding: 40px 0; }
        .form-group { margin-bottom: 24px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .form-label { display: block; margin-bottom: 8px; font-weight: 600; font-size: 15px; color: #1F2937; font-family: "Outfit", sans-serif; }
        .form-input, .form-textarea { width: 100%; padding: 14px 18px; border: 1px solid #E5E7EB; border-radius: 12px; font-size: 15px; outline: none; font-family: "Outfit", sans-serif; transition: all 0.3s; box-sizing: border-box; background-color: white; }
        .form-input:focus, .form-textarea:focus { border-color: #14B8A6; box-shadow: 0 0 0 3px rgba(20,184,166,0.1); }
        .form-textarea { resize: vertical; }
        .submit-btn { width: 100%; padding: 18px; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: white; border: none; border-radius: 16px; font-size: 18px; font-weight: 700; cursor: pointer; font-family: "Outfit", sans-serif; box-shadow: 0 8px 25px rgba(20,184,166,0.4); transition: all 0.3s; }
        .submit-btn:hover:not(.loading) { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(20,184,166,0.5); }
        .submit-btn.loading { background: #CBD5E0; cursor: not-allowed; }

        @media (max-width: 768px) {
          .hero-section { padding: 40px 16px !important; }
          .hero-title { font-size: 28px !important; }
          .hero-subtitle { font-size: 15px !important; }
          .form-container { margin: 0 auto 60px !important; padding: 0 16px !important; }
          .register-form { padding: 24px 0 !important; }
          .form-group { margin-bottom: 20px !important; }
          .form-row { grid-template-columns: 1fr !important; gap: 20px !important; margin-bottom: 0 !important; }
          .form-label { font-size: 14px !important; }
          .form-input, .form-textarea { padding: 12px 16px !important; font-size: 14px !important; }
          .submit-btn { padding: 16px !important; font-size: 16px !important; }
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;
