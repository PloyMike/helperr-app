import React, { useState } from 'react';
import { supabase } from './supabase';

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    bio: '',
    country: 'Thailand',
    city: '',
    category: '',
    subcategory: '',
    job: '',
    price: '',
    tags: '',
    languages: 'Thai, English',
    line_id: '',
    available: true
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
    'Diving & Water Sports': ['PADI Courses', 'Snorkeling', 'Kayaking', 'Paddleboarding'],
    'Other': ['Custom Service']
  };

  const categories = Object.keys(subcategories);
  const countries = ['Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'Malaysia', 'Singapore'];
  
  const citiesByCountry = {
    'Thailand': ['Bangkok', 'Phuket', 'Koh Samui', 'Chiang Mai', 'Pattaya', 'Hua Hin', 'Krabi', 'Koh Phangan'],
    'Vietnam': ['Ho Chi Minh City', 'Hanoi', 'Da Nang', 'Hoi An', 'Nha Trang'],
    'Indonesia': ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok'],
    'Philippines': ['Manila', 'Cebu', 'Boracay', 'Palawan'],
    'Malaysia': ['Kuala Lumpur', 'Penang', 'Langkawi'],
    'Singapore': ['Singapore']
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
          user_id: authData.user.id,
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          country: formData.country,
          city: formData.city,
          category: formData.category,
          subcategory: formData.subcategory,
          job: formData.job,
          price: formData.price,
          tags: tagsArray,
          languages: languagesArray,
          line_id: formData.line_id,
          available: formData.available,
          verified: false,
          rating: 5.0,
          review_count: 0
        }]);

      if (profileError) throw profileError;

      alert('✅ Registration successful! You can now login.');
      window.navigateTo('login');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.card}>
        <h1 style={styles.title}>Become a Provider</h1>
        <p style={styles.subtitle}>Create your profile and start your business on Helperr</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📧 Account</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={styles.input} placeholder="your@email.com" />
              </div>
              <div>
                <label style={styles.label}>Password *</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={styles.input} placeholder="Min. 6 characters" minLength={6} />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Location</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Your Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} placeholder="John Doe" />
              </div>
              <div>
                <label style={styles.label}>Country *</label>
                <select required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value, city: ''})} style={styles.input}>
                  <option value="">-- Select Country --</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {formData.country && (
                <div>
                  <label style={styles.label}>City *</label>
                  <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={styles.input}>
                    <option value="">-- Select City --</option>
                    {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💼 Service</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Category *</label>
                <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})} style={styles.input}>
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              {formData.category && (
                <div>
                  <label style={styles.label}>Specialization *</label>
                  <select required value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} style={styles.input}>
                    <option value="">-- Select Specialization --</option>
                    {subcategories[formData.category].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label style={styles.label}>Job Title *</label>
                <input type="text" required value={formData.job} onChange={(e) => setFormData({...formData, job: e.target.value})} style={styles.input} placeholder="e.g. Certified Massage Therapist" />
              </div>
              <div>
                <label style={styles.label}>Price *</label>
                <input type="text" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={styles.input} placeholder="e.g. ฿500/hr or $50/hour" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Skills/Tags (comma-separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} style={styles.input} placeholder="Thai Massage, Deep Tissue, Hot Stone" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>About You *</label>
                <textarea required value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{...styles.input, minHeight: 100, resize: 'vertical'}} placeholder="Describe your experience and services..." />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📱 Contact</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} placeholder="+66 81 234 5678" />
              </div>
              <div>
                <label style={styles.label}>LINE ID</label>
                <input type="text" value={formData.line_id} onChange={(e) => setFormData({...formData, line_id: e.target.value})} style={styles.input} placeholder="your_line_id" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Languages (comma-separated)</label>
                <input type="text" value={formData.languages} onChange={(e) => setFormData({...formData, languages: e.target.value})} style={styles.input} placeholder="Thai, English, German" />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⏰ Availability</h3>
            <label style={styles.checkbox}>
              <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} />
              <div>
                <div style={styles.checkboxTitle}>I am currently available</div>
                <div style={styles.checkboxSub}>Customers can book you immediately</div>
              </div>
            </label>
          </div>

          <button type="submit" disabled={loading} style={{...styles.btnPrimary, opacity: loading ? 0.6 : 1}}>
            {loading ? 'Creating...' : '✨ Register Now'}
          </button>

          <p style={styles.footer}>
            Already have an account?{' '}
            <span onClick={() => window.navigateTo('login')} style={styles.link}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)', padding: '40px 20px', fontFamily: '"Outfit", sans-serif' },
  card: { maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 24, padding: '40px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' },
  title: { fontSize: 32, fontWeight: 800, color: '#1F2937', marginBottom: 8, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#6B7280', marginBottom: 32, fontSize: 15 },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  section: { background: '#F9FAFB', padding: 20, borderRadius: 16 },
  sectionTitle: { margin: '0 0 16px 0', fontSize: 16, fontWeight: 700, color: '#1F2937' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box', background: 'white' },
  checkbox: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  checkboxTitle: { fontWeight: 600, color: '#1F2937', fontSize: 14 },
  checkboxSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  btnPrimary: { padding: '16px 24px', background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8, boxShadow: '0 4px 12px rgba(20,184,166,0.3)' },
  footer: { textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 8 },
  link: { color: '#14B8A6', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }
};

export default RegisterPage;
