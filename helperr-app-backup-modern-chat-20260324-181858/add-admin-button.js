const fs = require('fs');
let content = fs.readFileSync('src/Header.jsx', 'utf8');

// Füge Admin-Button nach "Favoriten" hinzu (vor Login/Logout)
content = content.replace(
  /<button onClick=\{\(\)=>navigateTo\('favorites'\)\} className="nav-link">/,
  `<button onClick={()=>navigateTo('favorites')} className="nav-link">
              <span className="badge-container">
                Favoriten
                {favCount>0&&<span className="badge">{favCount}</span>}
              </span>
            </button>
            <button onClick={()=>navigateTo('admin')} className="nav-link">
              👑 Admin`
);

// Füge Admin auch im Mobile Menu hinzu
content = content.replace(
  /<button onClick=\{\(\)=>\{navigateTo\('favorites'\);setShowMobileMenu\(false\);\}\} className="mobile-menu-item">/,
  `<button onClick={()=>{navigateTo('favorites');setShowMobileMenu(false);}} className="mobile-menu-item">
                Favoriten
                {favCount>0&&<span className="unread-badge">{favCount}</span>}
              </button>
              <button onClick={()=>{navigateTo('admin');setShowMobileMenu(false);}} className="mobile-menu-item">
                Admin`
);

fs.writeFileSync('src/Header.jsx', content);
console.log('✅ Admin button added to header!');
