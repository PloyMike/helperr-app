const fs = require('fs');
let content = fs.readFileSync('src/ProviderRegistration.jsx', 'utf8');

// Modal-content transparent machen
content = content.replace(
  /\.modal-content \{\s*background-color: #fff;/,
  `.modal-content {
          background-color: transparent;`
);

// Close-button Farbe anpassen für transparenten Hintergrund
content = content.replace(
  /\.close-button \{\s*position: absolute;\s*top: 20px;\s*right: 20px;\s*background: none;\s*border: none;\s*font-size: 32px;\s*cursor: pointer;\s*color: #666;/,
  `.close-button {
          position: absolute;
          top: 20px;
          right: 20px;
          background: white;
          border: none;
          font-size: 32px;
          cursor: pointer;
          color: #1F2937;
          border-radius: 50%;`
);

// Form inputs und labels weißer Hintergrund
content = content.replace(
  /\.form-input, \.form-textarea \{\s*width: 100%;\s*padding: 14px;\s*border: 1px solid #e5e7eb;/,
  `.form-input, .form-textarea {
          width: 100%;
          padding: 14px;
          border: 1px solid #e5e7eb;
          background-color: white;`
);

// Modal title und subtitle weiß machen
content = content.replace(
  /\.modal-title \{\s*margin-bottom: 12px;\s*color: #1d4ed8;/,
  `.modal-title {
          margin-bottom: 12px;
          color: white;`
);

content = content.replace(
  /\.modal-subtitle \{\s*margin-bottom: 50px;\s*color: #666;/,
  `.modal-subtitle {
          margin-bottom: 50px;
          color: white;`
);

// Labels weiß
content = content.replace(
  /\.form-label \{\s*display: block;\s*margin-bottom: 12px;\s*font-weight: 600;\s*font-size: 15px;\s*color: #1F2937;/,
  `.form-label {
          display: block;
          margin-bottom: 12px;
          font-weight: 600;
          font-size: 15px;
          color: white;`
);

// Mobile close button anpassen
content = content.replace(
  /\.close-button \{\s*top: 20px !important;\s*right: 20px !important;\s*font-size: 28px !important;\s*width: 28px !important;\s*height: 28px !important;\s*\}/,
  `.close-button {
            top: 20px !important;
            right: 20px !important;
            font-size: 28px !important;
            width: 40px !important;
            height: 40px !important;
            background: white !important;
            border-radius: 50% !important;
          }`
);

fs.writeFileSync('src/ProviderRegistration.jsx', content);
console.log('✅ Provider modal transparent!');
