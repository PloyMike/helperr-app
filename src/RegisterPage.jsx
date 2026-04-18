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
    priceAmount: '',
    currency: 'EUR',
    priceType: 'hour',
    tags: '',
    languages: '',
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
      // 1. Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      // 2. Insert provider profile
      const { error: insertError } = await supabase.from('profiles').insert([{
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        country: formData.country,
        city: formData.city,
        category: formData.category,
        subcategory: formData.subcategory,
        job: formData.job,
        price_amount: formData.priceAmount,
        currency: formData.currency,
        price_type: formData.priceType,
        price: `${formData.priceAmount} ${formData.currency}/${formData.priceType}`,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        available: formData.available,
        verified: false,
        id_status: 'pending',
        rating: 0,
        review_count: 0,
        total_bookings: 0,
        user_id: authData.user.id
      }]);

      if (insertError) throw insertError;

      alert('✅ Registration successful! Please check your email to verify your account.');
      window.navigateTo('login');
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', padding: '40px 20px', fontFamily: '"Outfit", sans-serif' },
    card: { maxWidth: 800, margin: '0 auto', background: 'white', borderRadius: 20, padding: 40, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
    title: { fontSize: 32, fontWeight: 800, marginBottom: 12, color: '#1F2937', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 40, textAlign: 'center' },
    section: { marginBottom: 40 },
    sectionTitle: { fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1F2937' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
    label: { display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: '#374151' },
    input: { width: '100%', padding: 12, border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 15, fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box' },
    btn: { width: '100%', padding: 16, background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 10, fontSize: 18, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
    backBtn: { background: 'transparent', border: 'none', color: '#065f46', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div style={styles.card}>
        <button onClick={() => window.navigateTo('home')} style={styles.backBtn}>
          ← Back to Home
        </button>

        <h1 style={styles.title}>Become a Provider</h1>
        <p style={styles.subtitle}>Create your account and start offering services</p>

        <form onSubmit={handleSubmit}>
          {/* ACCOUNT */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Account</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Email *</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Password *</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} />
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Basic Info</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Country *</label>
                <select required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value, city: '' })} style={styles.input}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} style={styles.input}>
                  <option value="">-- Select City --</option>
                  {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Languages *</label>
                <input type="text" required value={formData.languages} onChange={(e) => setFormData({ ...formData, languages: e.target.value })} style={styles.input} placeholder="English, German, Thai" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>About You *</label>
                <textarea required value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} style={{ ...styles.input, minHeight: 100, resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* SERVICE */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Service</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Category *</label>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })} style={styles.input}>
                  <option value="">-- Select Category --</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Subcategory *</label>
                <select required value={formData.subcategory} onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })} style={styles.input} disabled={!formData.category}>
                  <option value="">-- Select Subcategory --</option>
                  {formData.category && subcategories[formData.category]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Job Title *</label>
                <input type="text" required value={formData.job} onChange={(e) => setFormData({ ...formData, job: e.target.value })} style={styles.input} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Pricing *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '4fr 4fr 4fr', gap: 16 }}>
                  <input type="number" required value={formData.priceAmount} onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })} style={styles.input} placeholder="Amount (e.g. 50)" />
                  <select value={formData.currency} onChange={(e) => setFormData({ ...formData, currency: e.target.value })} style={styles.input} required>
                    <option value="EUR">EUR €</option>
                    <option value="USD">USD $</option>
                    <option value="GBP">GBP £</option>
                    <option value="CHF">CHF</option>
                    <option value="THB">THB ฿</option>
                  </select>
                  <select value={formData.priceType} onChange={(e) => setFormData({ ...formData, priceType: e.target.value })} style={styles.input} required>
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                  </select>
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Skills/Tags (comma-separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} style={styles.input} placeholder="Thai Massage, Deep Tissue, Hot Stone" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating Account...' : 'Create Provider Account'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
