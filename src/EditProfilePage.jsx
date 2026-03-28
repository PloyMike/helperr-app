import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';
import Header from './Header';

function EditProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    city: '',
    country: 'Thailand',
    category: '',
    subcategory: '',
    job: '',
    price: '',
    tags: '',
    languages: '',
    line_id: '',
    available: true,
    image_url: ''
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

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          bio: data.bio || '',
          city: data.city || '',
          country: data.country || 'Thailand',
          category: data.category || '',
          subcategory: data.subcategory || '',
          job: data.job || '',
          price: data.price || '',
          tags: data.tags?.join(', ') || '',
          languages: data.languages?.join(', ') || '',
          line_id: data.line_id || '',
          available: data.available !== false,
          image_url: data.image_url || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      alert('✅ Image uploaded! Click "Save Changes" to update your profile.');
    } catch (error) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          city: formData.city,
          country: formData.country,
          category: formData.category,
          subcategory: formData.subcategory,
          job: formData.job,
          price: formData.price,
          tags: tagsArray,
          languages: languagesArray,
          line_id: formData.line_id,
          available: formData.available,
          image_url: formData.image_url
        })
        .eq('email', user.email);

      if (error) throw error;

      alert('✅ Profile updated successfully!');
      window.navigateTo('home');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loginRequired}>
          <div style={{ fontSize: 64 }}>🔐</div>
          <h2>Login Required</h2>
          <p>Please login to edit your profile</p>
          <button onClick={() => window.navigateTo('login')} style={styles.btnPrimary}>
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loading}>
          <div style={{ fontSize: 48 }}>✏️</div>
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.noProfile}>
          <div style={{ fontSize: 64 }}>👤</div>
          <h2>No Profile Found</h2>
          <p>You need to create a provider profile first</p>
          <button onClick={() => window.navigateTo('register')} style={styles.btnPrimary}>
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header transparent={true} />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Edit Profile</h1>
          <p style={styles.heroSub}>Update your information and services</p>
        </div>
      </div>

      <div style={styles.container}>
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {/* PROFILE IMAGE */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📸 Profile Image</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {formData.image_url && formData.image_url.startsWith('http') ? (
                <img src={formData.image_url} alt="Profile" style={{ width: 100, height: 100, borderRadius: 16, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 100, height: 100, background: '#ecfdf5', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
                  {formData.image_url || '👤'}
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload" style={{...styles.uploadBtn, opacity: uploading ? 0.6 : 1, cursor: uploading ? 'not-allowed' : 'pointer'}}>
                  {uploading ? '📤 Uploading...' : '📷 Upload New Photo'}
                </label>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📍 Basic Info</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Phone *</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Country *</label>
                <select required value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value, city: ''})} style={styles.input}>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>City *</label>
                <select required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} style={styles.input}>
                  <option value="">-- Select City --</option>
                  {citiesByCountry[formData.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>About You *</label>
                <textarea required value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} style={{...styles.input, minHeight: 100, resize: 'vertical'}} />
              </div>
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
                <input type="text" required value={formData.job} onChange={(e) => setFormData({...formData, job: e.target.value})} style={styles.input} />
              </div>
              <div>
                <label style={styles.label}>Price *</label>
                <input type="text" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={styles.input} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={styles.label}>Skills/Tags (comma-separated)</label>
                <input type="text" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} style={styles.input} placeholder="Thai Massage, Deep Tissue, Hot Stone" />
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📱 Contact</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>LINE ID</label>
                <input type="text" value={formData.line_id} onChange={(e) => setFormData({...formData, line_id: e.target.value})} style={styles.input} />
              </div>
              <div>
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

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => window.navigateTo('home')} style={styles.btnSecondary}>
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} style={{...styles.btnPrimary, flex: 1, opacity: (saving || uploading) ? 0.6 : 1}}>
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 100%)', padding: '120px 20px 40px', marginBottom: 40 },
  heroInner: { maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  container: { maxWidth: 800, margin: '0 auto', padding: '0 20px 60px' },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  section: { background: 'white', padding: 24, borderRadius: 16, border: '1.5px solid #e5e7eb', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)', transition: 'all 0.2s' },
  sectionTitle: { margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1F2937' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box', background: 'white' },
  uploadBtn: { display: 'inline-block', padding: '12px 20px', background: '#f3f4f6', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: '"Outfit", sans-serif', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)', transition: 'all 0.2s' },
  checkbox: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  checkboxTitle: { fontWeight: 600, color: '#1F2937', fontSize: 14 },
  checkboxSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  btnPrimary: { padding: '14px 24px', background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(6,95,70,0.3)' },
  btnSecondary: { padding: '14px 24px', background: 'white', color: '#374151', border: '2px solid #E5E7EB', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)', transition: 'all 0.2s' },
  loginRequired: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 },
  noProfile: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 20 }
};

export default EditProfilePage;
