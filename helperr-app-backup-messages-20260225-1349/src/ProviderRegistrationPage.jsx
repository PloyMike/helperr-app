import React, { useState } from 'react';
import { supabase } from './supabase';

function ProviderRegistration({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    city: '',
    country: '',
    price: '',
    bio: '',
    phone: '',
    email: '',
    whatsapp: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          name: formData.name,
          job: formData.job,
          city: formData.city,
          country: formData.country,
          price: formData.price,
          bio: formData.bio,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
          available: true,
          verified: false,
          id_status: 'pending',
          rating: 0,
          review_count: 0,
          total_bookings: 0
        }]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Fehler beim Registrieren. Bitte versuche es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 40,
        maxWidth: 600,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ×
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 64 }}>✅</div>
            <h2>Erfolgreich registriert!</h2>
            <p>Dein Profil wird in Kürze geprüft.</p>
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 10, color: '#1d4ed8' }}>Als Anbieter registrieren</h2>
            <p style={{ marginBottom: 30, color: '#666' }}>
              Fülle das Formular aus um dein Profil zu erstellen.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  placeholder="Dein vollständiger Name"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Beruf / Service *
                </label>
                <input
                  type="text"
                  name="job"
                  value={formData.job}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  placeholder="z.B. Putzfrau, Babysitter, Koch..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Stadt *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 16
                    }}
                    placeholder="Berlin"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Land *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: 12,
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      fontSize: 16
                    }}
                    placeholder="Deutschland"
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Preis *
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  placeholder="z.B. 20€/Std oder €500/Tag"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Über mich
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16,
                    fontFamily: 'inherit'
                  }}
                  placeholder="Beschreibe deine Erfahrung und Services..."
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  placeholder="+49 123 456789"
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  E-Mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  placeholder="deine@email.com"
                />
              </div>

              <div style={{ marginBottom: 30 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 16
                  }}
                  placeholder="+49 123 456789"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 16,
                  backgroundColor: loading ? '#93c5fd' : '#1d4ed8',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
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

