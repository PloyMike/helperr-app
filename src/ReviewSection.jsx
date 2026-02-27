import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

function ReviewSection({ profileId, profileName }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    reviewer_name: '',
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('reviews').insert([{
        profile_id: profileId,
        ...newReview
      }]);

      if (error) throw error;

      setNewReview({ reviewer_name: '', rating: 5, comment: '' });
      setShowForm(false);
      fetchReviews();

      const avgRating = [...reviews, newReview].reduce((sum, r) => sum + r.rating, 0) / (reviews.length + 1);
      await supabase.from('profiles').update({
        rating: avgRating.toFixed(1),
        review_count: reviews.length + 1
      }).eq('id', profileId);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Fehler beim Speichern der Bewertung');
    }
  };

  return (
    <div className="review-section">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="review-header">
        <h2 className="review-title">Bewertungen ({reviews.length})</h2>
        <button onClick={()=>setShowForm(!showForm)} className="review-toggle-btn">
          {showForm ? 'Abbrechen' : 'Bewertung schreiben'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <input
            required
            type="text"
            placeholder="Dein Name"
            value={newReview.reviewer_name}
            onChange={(e)=>setNewReview({...newReview, reviewer_name: e.target.value})}
            className="review-input"
          />
          <select
            value={newReview.rating}
            onChange={(e)=>setNewReview({...newReview, rating: parseInt(e.target.value)})}
            className="review-select"
          >
            <option value={5}>5 Sterne</option>
            <option value={4}>4 Sterne</option>
            <option value={3}>3 Sterne</option>
            <option value={2}>2 Sterne</option>
            <option value={1}>1 Stern</option>
          </select>
          <textarea
            required
            placeholder="Deine Bewertung..."
            value={newReview.comment}
            onChange={(e)=>setNewReview({...newReview, comment: e.target.value})}
            className="review-textarea"
          />
          <button type="submit" className="review-submit-btn">Bewertung abschicken</button>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Noch keine Bewertungen vorhanden.</p>
            <p>Sei der Erste und schreibe eine Bewertung für {profileName}!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header-card">
                <div>
                  <div className="reviewer-name">{review.reviewer_name}</div>
                  <div className="review-date">{new Date(review.created_at).toLocaleDateString('de-DE')}</div>
                </div>
                <div className="review-stars">{'⭐'.repeat(review.rating)}</div>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>

      <style>{`
        .review-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          background: transparent;
        }
        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .review-title {
          font-size: 24px;
          font-weight: 700;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .review-toggle-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .review-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .review-form {
          background-color: #F9FAFB;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .review-input, .review-select, .review-textarea {
          padding: 14px 18px;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          font-family: "Outfit", sans-serif;
        }
        .review-textarea {
          min-height: 120px;
          resize: vertical;
        }
        .review-submit-btn {
          padding: 14px;
          background: #1F2937;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .review-submit-btn:hover {
          background: #14B8A6;
        }
        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .no-reviews {
          text-align: center;
          padding: 60px 20px;
          color: #9CA3AF;
        }
        .no-reviews p {
          font-size: 16px;
          margin: 8px 0;
          font-family: "Outfit", sans-serif;
        }
        .review-card {
          background-color: #F9FAFB;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #E5E7EB;
        }
        .review-header-card {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .reviewer-name {
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
          margin-bottom: 4px;
        }
        .review-date {
          font-size: 13px;
          color: #9CA3AF;
          font-family: "Outfit", sans-serif;
        }
        .review-stars {
          font-size: 18px;
        }
        .review-comment {
          font-size: 15px;
          line-height: 1.7;
          color: #4B5563;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .review-section {
            padding: 0 !important;
            text-align: center;
          }
          .review-header {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: center !important;
          }
          .review-title {
            font-size: 20px !important;
          }
          .review-toggle-btn {
            width: 100%;
            padding: 12px !important;
            font-size: 14px !important;
          }
          .review-form {
            padding: 16px !important;
          }
          .review-input, .review-select, .review-textarea {
            font-size: 14px !important;
          }
          .review-card {
            padding: 16px !important;
            text-align: left;
          }
          .review-header-card {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .review-stars {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ReviewSection;
