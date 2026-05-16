import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function ReviewSection({ profileId, profileName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reviewer_name: '',
    rating: 5,
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [profileId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          profile_id: profileId,
          reviewer_name: formData.reviewer_name,
          rating: formData.rating,
          comment: formData.comment
        }]);

      if (error) throw error;

      // Reset form
      setFormData({ reviewer_name: '', rating: 5, comment: '' });
      setShowForm(false);
      
      // Reload reviews
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Fehler beim Speichern der Bewertung');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.round(rating));
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Lädt Bewertungen...</div>;
  }

  return (
    <div>
      {/* Average Rating */}
      <div style={{ marginBottom: 30 }}>
        {reviews.length > 0 ? (
          <div>
            <div style={{ fontSize: 48, fontWeight: 700, color: '#667eea', marginBottom: 10 }}>
              {averageRating} {renderStars(averageRating)}
            </div>
            <p style={{ color: '#718096', fontSize: 16 }}>
              Basierend auf {reviews.length} {reviews.length === 1 ? 'Bewertung' : 'Bewertungen'}
            </p>
          </div>
        ) : (
          <p style={{ color: '#718096' }}>Noch keine Bewertungen vorhanden.</p>
        )}
      </div>

      {/* Add Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 30
          }}
        >
          ✍️ Bewertung schreiben
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#f7fafc',
          padding: 24,
          borderRadius: 12,
          marginBottom: 30
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>
            Bewerte {profileName}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Dein Name *
              </label>
              <input
                type="text"
                value={formData.reviewer_name}
                onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 15
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Bewertung *
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    style={{
                      fontSize: 32,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      opacity: star <= formData.rating ? 1 : 0.3
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                Kommentar
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 15,
                  resize: 'vertical'
                }}
                placeholder="Teile deine Erfahrung..."
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 24px',
                  background: submitting ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Wird gespeichert...' : 'Bewertung abschicken'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#4a5568',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {reviews.map(review => (
          <div
            key={review.id}
            style={{
              padding: 20,
              backgroundColor: '#f7fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                  {review.reviewer_name}
                </h4>
                <div style={{ fontSize: 20 }}>
                  {renderStars(review.rating)}
                </div>
              </div>
              <div style={{ fontSize: 13, color: '#718096' }}>
                {new Date(review.created_at).toLocaleDateString('de-DE')}
              </div>
            </div>
            {review.comment && (
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4a5568', margin: 0 }}>
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewSection;
