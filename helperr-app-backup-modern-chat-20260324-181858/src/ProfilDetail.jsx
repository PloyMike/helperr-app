import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import BookingCalendar from './BookingCalendar';
import ReviewSection from './ReviewSection';
import Header from './Header';
import Footer from './Footer';
import ChatModal from './ChatModal';
import { useAuth } from './AuthContext';

function ProfilDetail({ profile, onBack }) {
  const { user } = useAuth();
  const [showBooking, setShowBooking] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [viewCount, setViewCount] = useState(profile.view_count || 0);

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        const newCount = (profile.view_count || 0) + 1;
        const { error } = await supabase
          .from('profiles')
          .update({ view_count: newCount })
          .eq('id', profile.id);
        if (!error) setViewCount(newCount);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    incrementViewCount();
  }, [profile.id, profile.view_count]);

  const getBadge = () => {
    const days = profile.created_at ? Math.floor((new Date() - new Date(profile.created_at)) / (1000*60*60*24)) : 0;
    const rating = profile.rating || 0;
    if (rating >= 4.5 && (profile.review_count || 0) >= 5) return { text: 'Top-Rated', color: '#F97316', icon: '🏆' };
    if (viewCount > 100) return { text: 'Popular', color: '#14B8A6', icon: '🔥' };
    if (days < 7) return { text: 'New', color: '#06B6D4', icon: '✨' };
    return null;
  };

  const badge = getBadge();

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#F9FAFB'}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header/>
      
      <div className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-gradient"></div>
        <div className="hero-content">
          <button onClick={onBack} className="back-button">← Zurück</button>
          
          <div className="profile-header">
            <div className="avatar-box">
              {profile.image_url?<img src={profile.image_url} alt={profile.name} className="avatar-image"/>:<div className="avatar-placeholder">{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
            </div>

            <div className="info-box">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-job">{profile.job}</p>
              <p className="profile-location">{profile.city}, {profile.country}</p>
              
              <div className="badges">
                {profile.verified&&<span className="badge badge-verified">Verifiziert</span>}
                {profile.available&&<span className="badge badge-available">Verfügbar</span>}
                {profile.rating>0&&<span className="badge badge-rating">⭐ {profile.rating}</span>}
                {badge&&<span className="badge" style={{backgroundColor:badge.color}}>{badge.icon} {badge.text}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="content-grid">
          <div className="sidebar">
            {profile.languages&&<div className="detail-box">
              <h3 className="detail-title">Sprachen</h3>
              <div className="detail-tags">
                {profile.languages.split(',').map((lang,i)=><span key={i} className="detail-tag">{lang.trim()}</span>)}
              </div>
            </div>}

            {profile.services&&<div className="detail-box">
              <h3 className="detail-title">Services</h3>
              <div className="detail-tags">
                {profile.services.split(',').map((service,i)=><span key={i} className="detail-tag detail-tag-service">{service.trim()}</span>)}
              </div>
            </div>}
          </div>
        </div>

        <div className="about-section">
          <div className="about-box">
            <h2 className="section-title">Über mich</h2>
            <p className="about-text">{profile.bio||'Keine Beschreibung.'}</p>
            
            </div>
        </div>

        <div className="price-section">
          <div className="price-box">
            <div className="price-label">PREIS</div>
            <div className="price-amount">{profile.price||'Auf Anfrage'}</div>
            <button onClick={()=>setShowBooking(true)} className="booking-button">Jetzt buchen</button>
            <p className="price-note">Sichere Zahlung über die Plattform</p>
          </div>
        </div>

        <div className="chat-section">
          <div className="chat-box-bottom">
            <button onClick={()=>{
              if(!user){
                alert('Bitte logge dich ein um Nachrichten zu senden!');
                window.navigateTo('login');
              }else{
                setShowChat(true);
              }
            }} className="chat-button-bottom">Nachricht senden</button>
          </div>
        </div>

        <div className="reviews">
          <ReviewSection profileId={profile.id} profileName={profile.name}/>
        </div>

        <div className="stats-section">
          <h2 className="stats-title">Statistiken</h2>
          <p className="stat-item">👁️ {viewCount} Profilaufrufe</p>
          {profile.review_count>0&&<p className="stat-item">💬 {profile.review_count} Bewertungen</p>}
        </div>
      </div>

      <Footer/>

      {showBooking&&<BookingCalendar profile={profile} onClose={()=>setShowBooking(false)}/>}
      {showChat&&user&&<ChatModal profile={profile} onClose={()=>setShowChat(false)} currentUserEmail={user.email} currentUserName={user.user_metadata?.name || user.email}/>}

      <style>{`
        .hero-section {
          position: relative;
          overflow: hidden;
          padding: 75px 20px 25px;
          margin-top: 70px;
        }
        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url(https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80);
          background-size: cover;
          background-position: center;
          opacity: 0.7;
          z-index: 0;
        }
        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(250,250,250,0.9) 100%);
          z-index: 1;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .back-button {
          padding: 10px 20px;
          background-color: rgba(31,41,55,0.1);
          color: #1F2937;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 20px;
          font-family: "Outfit", sans-serif;
        }
        .profile-header {
          display: flex;
          gap: 32px;
          align-items: flex-start;
        }
        .avatar-box {
          background-color: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
          min-width: 280px;
        }
        .avatar-image {
          width: 240px;
          height: 240px;
          border-radius: 16px;
          object-fit: cover;
          display: block;
          border: 3px solid #14B8A6;
        }
        .avatar-placeholder {
          width: 240px;
          height: 240px;
          border-radius: 16px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          font-weight: 700;
          color: white;
          font-family: "Outfit", sans-serif;
        }
        .info-box {
          flex: 1;
          background-color: white;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        .profile-name {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
          font-family: "Outfit", sans-serif;
          color: #1F2937;
        }
        .profile-job {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          color: #14B8A6;
        }
        .profile-location {
          font-size: 16px;
          margin-bottom: 20px;
          font-family: "Outfit", sans-serif;
          color: #6B7280;
        }
        .badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .badge {
          padding: 8px 16px;
          color: white;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          font-family: "Outfit", sans-serif;
        }
        .badge-verified { background-color: #14B8A6; }
        .badge-available { background-color: #06B6D4; }
        .badge-rating { background-color: #F59E0B; }
        .content-section {
          max-width: 1200px;
          margin: 0 auto 60px;
          padding: 0 20px;
        }
        .content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 24px;
          margin-top: 40px;
        }
        .about-section {
          max-width: 1200px;
          margin: 0 auto 24px;
          padding: 0;
        }
        .about-box {
          background: transparent;
          padding: 0;
        }
        .section-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .about-text {
          font-size: 16px;
          line-height: 1.8;
          color: #4B5563;
          margin-bottom: 24px;
          font-family: "Outfit", sans-serif;
        }
        .stats {
          border-top: 1px solid #E5E7EB;
          padding-top: 24px;
        }
        .stats-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .stat-item {
          font-size: 15px;
          margin-bottom: 8px;
          color: #6B7280;
          font-family: "Outfit", sans-serif;
        }
        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .price-box {
          background: transparent;
          padding: 0;
        }
        .price-label {
          font-size: 14px;
          font-weight: 600;
          color: #9CA3AF;
          margin-bottom: 8px;
          font-family: "Outfit", sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .price-amount {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 50%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: "Outfit", sans-serif;
          letter-spacing: -1px;
          margin-bottom: 24px;
        }
        .booking-button {
          width: 100%;
          padding: 16px;
          background: #1F2937;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
          letter-spacing: 0.5px;
          margin-bottom: 16px;
        }
        .booking-button:hover {
          background: #14B8A6;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .price-note {
          font-size: 13px;
          color: #9CA3AF;
          text-align: center;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }
        .price-section {
          max-width: 1200px;
          margin: 0 auto 24px;
          padding: 0;
        }
        .chat-section {
          max-width: 1200px;
          margin: 0 auto 24px;
          padding: 0;
        }
        .chat-box-bottom {
          background: transparent;
          padding: 0;
        }
        .chat-button-bottom {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          font-family: "Outfit", sans-serif;
          transition: all 0.3s;
        }
        .chat-button-bottom:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(20,184,166,0.3);
        }
        .detail-box {
          background: transparent;
          padding: 0;
        }
        .detail-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1F2937;
          font-family: "Outfit", sans-serif;
        }
        .detail-tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .detail-tag {
          padding: 8px 16px;
          background-color: #F3F4F6;
          color: #1F2937;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
        }
        .detail-tag-service {
          background-color: #ECFDF5;
          color: #14B8A6;
        }
        .stats-section {
          max-width: 1200px;
          margin: 0 auto 60px;
          padding: 32px 0;
          border-top: 1px solid #E5E7EB;
        }
        .reviews {
          margin-top: 0;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 60px 16px 20px !important;
            margin-top: 70px !important;
          }
          .back-button {
            padding: 8px 16px !important;
            font-size: 14px !important;
            margin-bottom: 16px !important;
          }
          .profile-header {
            flex-direction: column !important;
            gap: 16px !important;
          }
          .avatar-box {
            background: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: auto !important;
            min-width: auto !important;
            text-align: center !important;
            margin: 0 auto 16px auto !important;
          }
          .avatar-image, .avatar-placeholder {
            width: 70px !important;
            height: 70px !important;
            margin: 0 auto !important;
            font-size: 32px !important;
            border-width: 2px !important;
          }
          .info-box {
            padding: 16px 12px !important;
            text-align: center !important;
            display: block !important;
            margin: 0 auto !important;
            width: calc(100% - 32px) !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
          }
          .profile-name {
            font-size: 24px !important;
            text-align: center !important;
          }
          .profile-job {
            font-size: 16px !important;
            text-align: center !important;
          }
          .profile-location {
            font-size: 14px !important;
            text-align: center !important;
          }
          .badges {
            gap: 6px !important;
            justify-content: center !important;
          }
          .badge {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
          .content-section {
            padding: 0 16px !important;
          }
          .content-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-top: 30px !important;
          }
          .about-section {
            padding: 0 !important;
            margin-bottom: 20px !important;
          }
          .about-box {
            padding: 0 !important;
            text-align: center !important;
          }
          .section-title {
            font-size: 20px !important;
          }
          .about-text {
            font-size: 14px !important;
            text-align: center !important;
          }
          .stats {
            text-align: center !important;
          }
          .stats-title {
            font-size: 16px !important;
          }
          .stat-item {
            font-size: 14px !important;
          }
          .price-box, .detail-box {
            padding: 0 !important;
            text-align: center !important;
          }
          .price-label {
            text-align: center !important;
          }
          .price-amount {
            font-size: 28px !important;
            text-align: center !important;
            letter-spacing: -0.5px !important;
          }
          .price-note {
            text-align: center !important;
          }
          .detail-tags {
            justify-content: center !important;
          }
          .booking-button {
            padding: 14px !important;
            font-size: 14px !important;
          }
          .detail-title {
            font-size: 18px !important;
          }
          .price-section {
            padding: 0 !important;
            margin-bottom: 24px !important;
          }
          .chat-section {
            padding: 0 !important;
            margin-bottom: 24px !important;
          }
          .chat-box-bottom {
            padding: 0 !important;
          }
          .stats-section {
            padding: 24px 0 !important;
            text-align: center !important;
            margin-bottom: 40px !important;
          }
          .chat-button-bottom {
            padding: 14px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProfilDetail;
