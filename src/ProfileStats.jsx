import React from 'react';

function ProfileStats({ profile }) {
  const getMemberSince = () => {
    if (!profile.created_at) return 'Neu';
    const created = new Date(profile.created_at);
    const now = new Date();
    const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    
    if (days < 7) return 'Neu';
    if (days < 30) return `${days} Tage`;
    if (days < 365) return `${Math.floor(days / 30)} Monate`;
    return `${Math.floor(days / 365)} Jahre`;
  };

  const getBadge = () => {
    const days = profile.created_at 
      ? Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24))
      : 0;
    const rating = profile.rating || 0;
    const views = profile.view_count || 0;

    if (rating >= 4.5 && profile.review_count >= 5) {
      return { text: 'Top-Bewertet', color: '#f6ad55', icon: '🏆' };
    }
    if (views > 100) {
      return { text: 'Beliebt', color: '#667eea', icon: '🔥' };
    }
    if (days < 7) {
      return { text: 'Neu', color: '#48bb78', icon: '✨' };
    }
    if (days < 30) {
      return { text: 'Aktiv', color: '#4299e1', icon: '⚡' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div style={{
      padding: 20,
      backgroundColor: '#f7fafc',
      borderRadius: 12,
      marginBottom: 20,
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#2d3748' }}>
        📊 Statistiken
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Views */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#718096', fontSize: 14 }}>👁️ Aufrufe</span>
          <span style={{ fontWeight: 700, color: '#2d3748' }}>
            {profile.view_count || 0}
          </span>
        </div>

        {/* Member Since */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#718096', fontSize: 14 }}>📅 Mitglied seit</span>
          <span style={{ fontWeight: 700, color: '#2d3748' }}>
            {getMemberSince()}
          </span>
        </div>

        {/* Reviews */}
        {profile.review_count > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#718096', fontSize: 14 }}>⭐ Bewertungen</span>
            <span style={{ fontWeight: 700, color: '#2d3748' }}>
              {profile.review_count}
            </span>
          </div>
        )}

        {/* Badge */}
        {badge && (
          <div style={{
            marginTop: 8,
            padding: '10px 16px',
            backgroundColor: badge.color,
            color: 'white',
            borderRadius: 8,
            textAlign: 'center',
            fontWeight: 700,
            fontSize: 15
          }}>
            {badge.icon} {badge.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileStats;
