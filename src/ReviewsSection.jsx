import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './AuthContext';

function ReviewsSection({ profileId, onReviewAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review_text: '',
    author_name: ''
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
      console.error('Error:', error);
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
          author_name: formData.author_name,
          rating: formData.rating,
          review_text: formData.review_text,
          review_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      // Update profile rating
      const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) + formData.rating) / (reviews.length + 1);
      await supabase
        .from('profiles')
        .update({ 
          rating: avgRating.toFixed(1),
          review_count: reviews.length + 1 
        })
        .eq('id', profileId);

      alert('✅ Review submitted successfully!');
      setShowForm(false);
      setFormData({ rating: 5, review_text: '', author_name: '' });
      fetchReviews();
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading reviews...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Reviews ({reviews.length})
        </h3>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={styles.btnAdd}>
            ✍️ Write a Review
          </button>
        )}
      </div>

      {/* REVIEW FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formHeader}>
            <h4 style={styles.formTitle}>Write Your Review</h4>
            <button type="button" onClick={() => setShowForm(false)} style={styles.btnClose}>
              ✕
            </button>
          </div>

          <div>
            <label style={styles.label}>Your Name *</label>
            <input
              type="text"
              required
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              style={styles.input}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label style={styles.label}>Rating *</label>
            <div style={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    ...styles.star,
                    color: star <= formData.rating ? '#F59E0B' : '#D1D5DB'
                  }}
                >
                  ★
                </button>
              ))}
              <span style={styles.ratingText}>{formData.rating} stars</span>
            </div>
          </div>

          <div>
            <label style={styles.label}>Your Review *</label>
            <textarea
              required
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              style={styles.textarea}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => setShowForm(false)} style={styles.btnCancel}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={styles.btnSubmit}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* REVIEWS LIST */}
      {reviews.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 48 }}>⭐</div>
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div style={styles.reviewsList}>
          {reviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div>
                  <div style={styles.reviewAuthor}>{review.author_name}</div>
                  <div style={styles.reviewDate}>
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={styles.reviewStars}>
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
              </div>
              <p style={styles.reviewText}>{review.review_text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { marginTop: 20 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 },
  btnAdd: { padding: '10px 20px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  form: { background: '#f9fafb', padding: 20, borderRadius: 16, marginBottom: 24, border: '1.5px solid #e5e7eb' },
  formHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  formTitle: { margin: 0, fontSize: 16, fontWeight: 700, color: '#111827' },
  btnClose: { background: '#fee2e2', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 14, color: '#dc2626' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 },
  input: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box', marginBottom: 16 },
  textarea: { width: '100%', padding: '12px 14px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: '"Outfit", sans-serif', boxSizing: 'border-box', resize: 'vertical', marginBottom: 16 },
  stars: { display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 },
  star: { background: 'none', border: 'none', fontSize: 32, cursor: 'pointer', padding: 0 },
  ratingText: { fontSize: 14, color: '#6b7280', marginLeft: 8, fontWeight: 600 },
  btnCancel: { flex: 1, padding: '12px', background: 'white', color: '#374151', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  btnSubmit: { flex: 1, padding: '12px', background: '#065f46', color: 'white', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: '"Outfit", sans-serif' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  reviewCard: { background: 'white', padding: 20, borderRadius: 16, border: '1.5px solid #e5e7eb' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reviewAuthor: { fontSize: 15, fontWeight: 700, color: '#111827' },
  reviewDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  reviewStars: { fontSize: 18, color: '#F59E0B' },
  reviewText: { fontSize: 14, color: '#374151', lineHeight: 1.6, margin: 0 },
  empty: { textAlign: 'center', padding: 40, background: 'white', borderRadius: 16, border: '1.5px solid #e5e7eb' },
  loading: { textAlign: 'center', padding: 40, color: '#6b7280' }
};

export default ReviewsSection;
