import React, { useState } from 'react';
import { AuthProvider } from './AuthContext';
import Helperr from './Helperr';
import ProfilDetail from './ProfilDetail';
import MyBookings from './MyBookings';
import Favorites from './Favorites';
import RegisterPage from './RegisterPage';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import MessagesPage from './MessagesPage';
import EditProfilePage from './EditProfilePage';
import Impressum from './Impressum';
import Datenschutz from './Datenschutz';
import AGB from './AGB';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedProfile, setSelectedProfile] = useState(null);

  window.navigateTo = (view, profile) => {
    setCurrentView(view);
    if (profile) setSelectedProfile(profile);
  };

  return (
    <AuthProvider>
      <div className="App">
        {currentView === 'home' ? (
          <Helperr />
        ) : currentView === 'profile' ? (
          <ProfilDetail profile={selectedProfile} onBack={() => setCurrentView('home')} />
        ) : currentView === 'bookings' ? (
          <MyBookings />
        ) : currentView === 'favorites' ? (
          <Favorites />
        ) : currentView === 'register' ? (
          <RegisterPage />
        ) : currentView === 'admin' ? (
          <AdminDashboard />
        ) : currentView === 'login' ? (
          <LoginPage />
        ) : currentView === 'signup' ? (
          <SignupPage />
        ) : currentView === 'messages' ? (
          <MessagesPage />
        ) : currentView === 'edit-profile' ? (
          <EditProfilePage />
        ) : currentView === 'impressum' ? (
          <Impressum />
        ) : currentView === 'datenschutz' ? (
          <Datenschutz />
        ) : currentView === 'agb' ? (
          <AGB />
        ) : (
          <Helperr />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
