import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

function ReviewsSection({ profileId, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
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
  }, [profileId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return <div style={styles.loading}>Loading reviews...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Reviews ({reviews.length})</h3>
        <div style={styles.note}>Reviews can be written after completing a booking</div>
      </div>

      {reviews.length === 0 ? (
        <div style={styles.empty}>No reviews yet. Be the first to book and review!</div>
      ) : (
        <div style={styles.reviewsList}>
          {reviews.map((review) => (
            <div key={review.id} style={styles.reviewItem}>
              <div style={styles.reviewHeader}>
                <div>
                  <div style={styles.reviewAuthor}>{review.author_name}</div>
                  <div style={styles.reviewDate}>
                    {new Date(review.review_date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div style={styles.reviewRating}>
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
  container: { marginTop: 24, paddingTop: 24, borderTop: '1px solid #e5e7eb' },
  loading: { textAlign: 'center', padding: 20, color: '#6b7280' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' },
  note: { fontSize: 12, color: '#6b7280', fontStyle: 'italic', background: '#f9fafb', padding: '6px 12px', borderRadius: 8 },
  empty: { textAlign: 'center', padding: 40, color: '#6b7280', fontSize: 14 },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  reviewItem: { padding: 16, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  reviewAuthor: { fontSize: 15, fontWeight: 600, color: '#111827' },
  reviewDate: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  reviewRating: { fontSize: 16, color: '#f59e0b' },
  reviewText: { margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }
};

export default ReviewsSection;
