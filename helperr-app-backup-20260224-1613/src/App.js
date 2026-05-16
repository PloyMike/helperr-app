import React, { useState } from 'react';
import Helperr from './Helperr';
import ProfilDetail from './ProfilDetail';
import MyBookings from './MyBookings';
import Favorites from './Favorites';
import RegisterPage from './RegisterPage';
import AdminDashboard from './AdminDashboard';
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
  );
}

export default App;
