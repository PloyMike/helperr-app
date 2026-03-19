import React, { useState } from 'react';
import { supabase } from './supabase';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    country: 'Thailand',
    category: '',
    subcategory: '',
    job: '',
    city: '',
    bio: '',
    price: '',
    phone: '',
    line_id: '',
    available: true,
    tags: '',
    languages: 'Thai, English'
  });

  const subcategories = {
    'Massage & Wellness': ['Traditional Thai Massage', 'Oil Massage', 'Foot Massage', 'Aromatherapy', 'Deep Tissue', 'Sports Massage'],
    'Tours & Adventures': ['Island Tours', 'Snorkeling', 'Diving', 'Kayaking', 'Hiking', 'Food Tours', 'Cultural Tours'],
    'Yoga & Fitness': ['Vinyasa Yoga', 'Yin Yoga', 'Hatha Yoga', 'Personal Training', 'Pilates', 'Beach Yoga'],
    'Cooking Classes': ['Thai Cooking', 'Vegetarian Cooking', 'Street Food', 'Desserts', 'Market Tours'],
    'Beauty & Spa': ['Manicure/Pedicure', 'Hair Styling', 'Facials', 'Makeup', 'Waxing'],
    'Photography': ['Wedding', 'Portrait', 'Events', 'Product', 'Travel'],
    'Teaching & Tutoring': ['English', 'Thai Language', 'Music', 'Art', 'Math/Science'],
    'Home Services': ['Cleaning', 'Repairs', 'Gardening', 'Pet Care', 'Babysitting'],
    'Transportation': ['Airport Transfer', 'Car Rental', 'Motorbike Rental', 'Private Driver'],
    'Other': ['Custom Service']
  };

  const categories = Object.keys(subcategories);
  
  const countries = ['Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore', 'Cambodia', 'Laos', 'Myanmar', 'Germany', 'Austria', 'Switzerland', 'France', 'Spain', 'Italy', 'Portugal'];
  
  const citiesByCountry = {
    'Thailand': ['Bangkok', 'Phuket', 'Koh Samui', 'Chiang Mai', 'Pattaya', 'Hua Hin', 'Krabi', 'Koh Phangan'],
    'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang'],
    'Indonesia': ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok', 'Gili Islands'],
    'Philippines': ['Manila', 'Cebu', 'Boracay', 'Palawan', 'Siargao'],
    'Malaysia': ['Kuala Lumpur', 'Penang', 'Langkawi', 'Melaka', 'Kota Kinabalu'],
    'Singapore': ['Singapore'],
    'Cambodia': ['Phnom Penh', 'Siem Reap', 'Sihanoukville'],
    'Laos': ['Vientiane', 'Luang Prabang', 'Vang Vieng'],
    'Myanmar': ['Yangon', 'Mandalay', 'Bagan'],
    'Germany': ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne'],
    'Austria': ['Vienna', 'Salzburg', 'Innsbruck', 'Graz'],
    'Switzerland': ['Zurich', 'Geneva', 'Basel', 'Bern', 'Lucerne'],
    'France': ['Paris', 'Lyon', 'Marseille', 'Nice', 'Bordeaux'],
    'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Malaga'],
    'Italy': ['Rome', 'Milan', 'Florence', 'Venice', 'Naples'],
    'Portugal': ['Lisbon', 'Porto', 'Faro', 'Coimbra']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          name: formData.name,
          country: formData.country,
          category: formData.category,
          subcategory: formData.subcategory,
          job: formData.job,
          city: formData.city,
          bio: formData.bio,
          price: formData.price,
          phone: formData.phone,
          line_id: formData.line_id,
          available: formData.available,
          tags: tagsArray,
          languages: languagesArray,
          verified: false,
          rating: 0,
          review_count: 0
        }]);

      if (profileError) throw profileError;

      alert('✅ Registrierung erfolgreich! Bitte bestätige deine E-Mail.');
      window.navigateTo('login');
    } catch (error) {
      alert('Fehler: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)', padding: '40px 20px', fontFamily: '"Outfit", sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 24, padding: '40px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1F2937', marginBottom: 8, textAlign: 'center' }}>Provider Registrierung</h1>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: 32, fontSize: 15 }}>Erstelle dein Profil und starte dein Business auf Helperr</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* ACCOUNT */}
          <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>📧 Account</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={styles.label}>E-Mail *</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={styles.input} placeholder="deine@email.com" /></div>
              <div><label style={styles.label}>Passwort *</label><input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={styles.input} placeholder="Min. 6 Zeichen" minLength={6} /></div>
            </div>
          </div>

          {/* LOCATION */}
          <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>📍 Standort</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={styles.label}>Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} placeholder="Ploy Siriwan" /></div>
              <div><label style={styles.label}>Land *</label><select required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value, city: ''})} style={styles.input}><option value="">-- Land wählen --</option>{countries.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              {formData.country && <div><label style={styles.label}>Stadt *</label><select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={styles.input}><option value="">-- Stadt wählen --</option>{citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}</select></div>}
            </div>
          </div>

          {/* SERVICE */}
          <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>💼 Service</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={styles.label}>Kategorie *</label><select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})} style={styles.input}><option value="">-- Kategorie --</option>{categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
              {formData.category && <div><label style={styles.label}>Spezialisierung *</label><select required value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} style={styles.input}><option value="">-- Spezialisierung --</option>{subcategories[formData.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}</select></div>}
              <div><label style={styles.label}>Job Titel *</label><input type="text" required value={formData.job} onChange={(e) => setFormData({...formData, job: e.target.value})} style={styles.input} placeholder="Certified Massage Therapist" /></div>
              <div><label style={styles.label}>Preis *</label><input type="text" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={styles.input} placeholder="฿500/hr oder €50/Stunde" /></div>
              <div><label style={styles.label}>Skills/Tags</label><input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} style={styles.input} placeholder="Thai Massage, Deep Tissue" /><p style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>Komma-getrennt</p></div>
              <div><label style={styles.label}>Über mich *</label><textarea required value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{...styles.input, minHeight: 100, resize: 'vertical'}} placeholder="Beschreibe deine Erfahrung..." /></div>
            </div>
          </div>

          {/* CONTACT */}
          <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>📱 Kontakt</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div><label style={styles.label}>Telefon *</label><input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} placeholder="+66 81 234 5678" /></div>
              <div><label style={styles.label}>LINE ID</label><input type="text" value={formData.line_id} onChange={(e) => setFormData({...formData, line_id: e.target.value})} style={styles.input} placeholder="dein_line_name" /><p style={{ fontSize: 12, color: '#6B7280', marginTop: 6 }}>💬 Wichtig in Asien</p></div>
              <div><label style={styles.label}>Sprachen</label><input type="text" value={formData.languages} onChange={(e) => setFormData({...formData, languages: e.target.value})} style={styles.input} placeholder="Thai, English, German" /></div>
            </div>
          </div>

          {/* AVAILABILITY */}
          <div style={{ background: '#F9FAFB', padding: 20, borderRadius: 16 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#1F2937' }}>⏰ Verfügbarkeit</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}><input type="checkbox" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} style={{ width: 20, height: 20, cursor: 'pointer' }} /><div><div style={{ fontWeight: 600, color: '#1F2937', fontSize: 14 }}>Ich bin derzeit verfügbar</div><div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Kunden können dich sofort buchen</div></div></label>
          </div>

          <button type="submit" disabled={loading} style={{ padding: '16px 24px', background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8, boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }}>{loading ? 'Wird erstellt...' : '✨ Jetzt Registrieren'}</button>
          
          <p style={{ textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 8 }}>Hast du schon einen Account? <span onClick={() => window.navigateTo('login')} style={{ color: '#14B8A6', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Einloggen</span></p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box', background: 'white' }
};

export default RegisterPage;
