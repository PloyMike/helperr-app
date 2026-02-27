const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

// Replace mobile styles - horizontal scroll
content = content.replace(
  /\/\* MOBILE RESPONSIVE \*\/[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}/,
  `/* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .hero-section {
            padding: 80px 16px 30px;
          }
          .hero-title {
            font-size: 28px !important;
          }
          .hero-subtitle {
            font-size: 15px !important;
            padding: 0 10px;
          }
          .search-container {
            padding: 0 10px;
          }
          .search-input {
            padding: 14px 50px 14px 16px !important;
            font-size: 14px !important;
          }
          .search-icon {
            right: 26px !important;
            font-size: 20px !important;
          }
          /* HORIZONTAL SCROLL für Profile Cards */
          .profile-grid {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
            gap: 16px !important;
            padding: 0 16px 20px 16px !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-padding: 0 16px !important;
          }
          .profile-grid::-webkit-scrollbar {
            display: none;
          }
          .profile-card {
            flex: 0 0 85% !important;
            max-width: 350px !important;
            scroll-snap-align: start !important;
            padding: 12px !important;
          }
          .fav-button {
            width: 36px !important;
            height: 36px !important;
            top: 12px !important;
            right: 12px !important;
            font-size: 18px !important;
          }
          .profile-image, .profile-avatar {
            width: 50px !important;
            height: 50px !important;
            margin-bottom: 10px !important;
            font-size: 24px !important;
            border-width: 2px !important;
          }
          .profile-name {
            font-size: 16px !important;
            margin-bottom: 4px !important;
          }
          .profile-job {
            font-size: 13px !important;
            margin-bottom: 6px !important;
          }
          .profile-location {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          .profile-price {
            font-size: 16px !important;
            margin-bottom: 8px !important;
          }
          .profile-bio {
            font-size: 12px !important;
            margin-bottom: 10px !important;
            line-height: 1.5 !important;
            -webkit-line-clamp: 2 !important;
          }
          .profile-badges {
            gap: 4px !important;
            margin-bottom: 10px !important;
          }
          .badge {
            padding: 4px 8px !important;
            font-size: 10px !important;
          }
          .profile-view-button {
            padding: 10px !important;
            font-size: 13px !important;
          }
          .map-section {
            padding: 30px 16px;
          }
          .map-title {
            font-size: 20px;
          }
        }`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Horizontal scroll enabled!');
