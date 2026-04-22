import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Helperr from './Helperr';
import ProfilDetail from './ProfilDetail';
import MyBookings from './MyBookings';
import ProviderBookingsPage from './ProviderBookingsPage';
import Favorites from './Favorites';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import ResetPasswordPage from './ResetPasswordPage';
import UpdatePasswordPage from './UpdatePasswordPage';
import SignupPage from './SignupPage';
import MessagesPage from './MessagesPage';
import EditProfilePage from './EditProfilePage';
import ProviderDashboard from './ProviderDashboard';
import Impressum from './Impressum';
import Datenschutz from './Datenschutz';
import AGB from './AGB';
import ChatbotWidget from './ChatbotWidget';

// 🔒 MAINTENANCE MODE - Set to true to show "Coming Soon" page
const MAINTENANCE_MODE = false;

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProfile, setSelectedProfile] = useState(null);

  window.navigateTo = (view, profile) => {
    setCurrentView(view);
    if (profile) setSelectedProfile(profile);
  };

  // 🔒 MAINTENANCE MODE SCREEN
  if (MAINTENANCE_MODE) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        fontFamily: '"Outfit", sans-serif',
        padding: 20
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <div style={{
          textAlign: 'center',
          color: 'white',
          maxWidth: 600
        }}>
          <h1 style={{
            fontSize: 72,
            fontWeight: 800,
            margin: '0 0 20px',
            background: 'white',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Helperr
          </h1>
          <h2 style={{
            fontSize: 32,
            fontWeight: 600,
            margin: '0 0 20px'
          }}>
            🚧 Under Maintenance
          </h2>
          <p style={{
            fontSize: 18,
            opacity: 0.9
          }}>
            We're currently working on improvements. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="App">
        {currentView === 'home' ? (
          <Helperr />
        ) : currentView === 'profile' ? (
          <ProfilDetail profile={selectedProfile} onBack={() => setCurrentView('home')} />
        ) : currentView === 'bookings' ? (
          <MyBookings />
        ) : currentView === 'provider-bookings' ? (
          <ProviderBookingsPage />
        ) : currentView === 'favorites' ? (
          <Favorites />
        ) : currentView === 'register' ? (
          <RegisterPage />
        ) : currentView === 'login' ? (
          <LoginPage />
        ) : currentView === 'reset-password' ? (
          <ResetPasswordPage />
        ) : currentView === 'update-password' ? (
          <UpdatePasswordPage />
        ) : currentView === 'signup' ? (
          <SignupPage />
        ) : currentView === 'messages' ? (
          <MessagesPage />
        ) : currentView === 'edit-profile' ? (
          <EditProfilePage />
        ) : currentView === 'dashboard' ? (
          <ProviderDashboard />
        ) : currentView === 'provider-dashboard' ? (
          <ProviderDashboard />
        ) : currentView === 'impressum' ? (
          <Impressum />
        ) : currentView === 'datenschutz' ? (
          <Datenschutz />
        ) : currentView === 'agb' ? (
          <AGB />
        ) : (
          <Helperr />
        )}
        
        {/* AI CHATBOT - Versteckt auf Messages Page */}
        {currentView !== 'messages' && <ChatbotWidget />}
      </div>
    </AuthProvider>
  );
}

export default App;
