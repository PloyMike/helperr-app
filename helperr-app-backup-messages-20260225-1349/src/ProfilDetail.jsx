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
      
      <div style={{position:'relative',overflow:'hidden',padding:'75px 20px 25px',marginTop:70}}>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundImage:'url(https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80)',backgroundSize:'cover',backgroundPosition:'center',opacity:0.7,zIndex:0}}></div>
        <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(250,250,250,0.9) 100%)',zIndex:1}}></div>
        <div style={{maxWidth:1200,margin:'0 auto',position:'relative',zIndex:2,color:'#1F2937'}}>
          <button onClick={onBack} style={{padding:'10px 20px',backgroundColor:'rgba(31,41,55,0.1)',color:'#1F2937',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',marginBottom:8,fontFamily:'"Outfit",sans-serif'}}>← Zurück</button>
          
          <div style={{display:'flex',gap:32,alignItems:'flex-start'}}>
            
            <div style={{backgroundColor:'white',borderRadius:20,padding:24,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',minWidth:280}}>
              {profile.image_url?<img src={profile.image_url} alt={profile.name} style={{width:240,height:240,borderRadius:16,objectFit:'cover',display:'block',border:'3px solid #14B8A6'}}/>:<div style={{width:240,height:240,borderRadius:16,background:'linear-gradient(135deg,#14B8A6 0%,#0D9488 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:80,fontWeight:700,color:'white',fontFamily:'"Outfit",sans-serif'}}>{profile.name?profile.name.charAt(0).toUpperCase():'?'}</div>}
            </div>

            <div style={{flex:1,backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
              <h1 style={{fontSize:36,fontWeight:800,marginBottom:8,fontFamily:'"Outfit",sans-serif',color:'#1F2937'}}>{profile.name}</h1>
              <p style={{fontSize:20,fontWeight:600,marginBottom:12,fontFamily:'"Outfit",sans-serif',color:'#14B8A6'}}>{profile.job}</p>
              <p style={{fontSize:16,marginBottom:20,fontFamily:'"Outfit",sans-serif',color:'#6B7280'}}>📍 {profile.city}, {profile.country}</p>
              
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {profile.verified&&<span style={{padding:'8px 16px',backgroundColor:'#14B8A6',color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>✓ Verifiziert</span>}
                {profile.available&&<span style={{padding:'8px 16px',backgroundColor:'#06B6D4',color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>Verfügbar</span>}
                {profile.rating>0&&<span style={{padding:'8px 16px',backgroundColor:'#F59E0B',color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>⭐ {profile.rating}</span>}
                {badge&&<span style={{padding:'8px 16px',backgroundColor:badge.color,color:'white',borderRadius:12,fontSize:14,fontWeight:700,fontFamily:'"Outfit",sans-serif'}}>{badge.icon} {badge.text}</span>}
              </div>
            </div>

          </div>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto 60px',padding:'0 20px',position:'relative',zIndex:1}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24}}>
          
          <div style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize:24,fontWeight:700,marginBottom:20,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Über mich</h2>
            <p style={{fontSize:16,lineHeight:1.8,color:'#4B5563',marginBottom:24,fontFamily:'"Outfit",sans-serif'}}>{profile.bio||'Keine Beschreibung.'}</p>
            
            <div style={{borderTop:'1px solid #E5E7EB',paddingTop:24,marginTop:24}}>
              <h3 style={{fontSize:18,fontWeight:700,marginBottom:16,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Statistiken</h3>
              <p style={{fontSize:15,marginBottom:8,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>👁️ {viewCount} Profilaufrufe</p>
              {profile.review_count>0&&<p style={{fontSize:15,color:'#6B7280',fontFamily:'"Outfit",sans-serif'}}>💬 {profile.review_count} Bewertungen</p>}
            </div>
          </div>

          <div>
            <div style={{backgroundColor:'white',borderRadius:20,padding:40,marginBottom:24,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',border:'1px solid #E5E7EB'}}>
              <div style={{borderBottom:'1px solid #F3F4F6',paddingBottom:24,marginBottom:24}}>
                <div style={{fontSize:14,fontWeight:600,color:'#9CA3AF',marginBottom:8,fontFamily:'"Outfit",sans-serif',textTransform:'uppercase',letterSpacing:'1px'}}>Preis</div>
                <div style={{fontSize:42,fontWeight:800,color:'#1F2937',fontFamily:'"Outfit",sans-serif',letterSpacing:'-1px'}}>{profile.price||'Auf Anfrage'}</div>
              </div>
              <button onClick={()=>setShowBooking(true)} style={{width:'100%',padding:'16px',background:'#1F2937',color:'white',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s',letterSpacing:'0.5px',marginBottom:16}} onMouseOver={(e)=>{e.target.style.background='#14B8A6';e.target.style.transform='translateY(-2px)';e.target.style.boxShadow='0 8px 25px rgba(20,184,166,0.3)';}} onMouseOut={(e)=>{e.target.style.background='#1F2937';e.target.style.transform='translateY(0)';e.target.style.boxShadow='none';}}>Jetzt buchen</button>
              <p style={{fontSize:13,color:'#9CA3AF',marginBottom:16,textAlign:'center',fontFamily:'"Outfit",sans-serif'}}>💬 Sichere Zahlung über die Plattform</p>
            </div>

            <div style={{backgroundColor:'white',borderRadius:20,padding:32,marginBottom:24,boxShadow:'0 8px 30px rgba(0,0,0,0.1)',border:'1px solid #E5E7EB'}}>
              <button onClick={()=>{
                if(!user){
                  alert('Bitte logge dich ein um Nachrichten zu senden!');
                  window.navigateTo('login');
                }else{
                  setShowChat(true);
                }
              }} style={{width:'100%',padding:'16px',background:'transparent',color:'#14B8A6',border:'2px solid #14B8A6',borderRadius:12,fontSize:15,fontWeight:600,cursor:'pointer',fontFamily:'"Outfit",sans-serif',transition:'all 0.3s'}} onMouseOver={(e)=>{e.target.style.background='#14B8A6';e.target.style.color='white';}} onMouseOut={(e)=>{e.target.style.background='transparent';e.target.style.color='#14B8A6';}}>
                💬 Nachricht senden
              </button>
            </div>

            {profile.languages&&<div style={{backgroundColor:'white',borderRadius:20,padding:32,marginBottom:24,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Sprachen</h3>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {profile.languages.split(',').map((lang,i)=><span key={i} style={{padding:'8px 16px',backgroundColor:'#F3F4F6',color:'#1F2937',borderRadius:12,fontSize:14,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>{lang.trim()}</span>)}
              </div>
            </div>}

            {profile.services&&<div style={{backgroundColor:'white',borderRadius:20,padding:32,boxShadow:'0 8px 30px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:16,color:'#1F2937',fontFamily:'"Outfit",sans-serif'}}>Services</h3>
              <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                {profile.services.split(',').map((service,i)=><span key={i} style={{padding:'8px 16px',backgroundColor:'#ECFDF5',color:'#14B8A6',borderRadius:12,fontSize:14,fontWeight:600,fontFamily:'"Outfit",sans-serif'}}>{service.trim()}</span>)}
              </div>
            </div>}
          </div>
        </div>

        <div style={{marginTop:40}}>
          <ReviewSection profileId={profile.id} profileName={profile.name}/>
        </div>
      </div>

      <Footer/>

      {showBooking&&<BookingCalendar profile={profile} onClose={()=>setShowBooking(false)}/>}
      {showChat&&user&&<ChatModal profile={profile} onClose={()=>setShowChat(false)} currentUserEmail={user.email} currentUserName={user.user_metadata?.name || user.email}/>}
    </div>
  );
}

export default ProfilDetail;
