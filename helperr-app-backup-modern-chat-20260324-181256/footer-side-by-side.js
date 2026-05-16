const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Update Mobile Styles - Echte 2-Spalten nebeneinander
content = content.replace(
  /\/\* MOBILE \*\/[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}/,
  `/* MOBILE */
        @media (max-width: 768px) {
          .footer {
            padding: 30px 16px 16px !important;
          }
          .footer-content {
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
            margin-bottom: 20px !important;
          }
          /* Helperr - Oben zentriert */
          .footer-section:nth-child(1) {
            text-align: center !important;
            width: 100% !important;
          }
          /* Container Wrapper für 2 Spalten */
          .footer-content {
            position: relative !important;
          }
          /* Unternehmen & Support nebeneinander */
          .footer-section:nth-child(2) {
            float: left !important;
            width: 50% !important;
            text-align: left !important;
            padding-right: 8px !important;
            box-sizing: border-box !important;
          }
          .footer-section:nth-child(3) {
            float: right !important;
            width: 50% !important;
            text-align: left !important;
            padding-left: 8px !important;
            box-sizing: border-box !important;
          }
          .footer-section {
            gap: 8px !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .footer-title {
            font-size: 20px !important;
          }
          .footer-subtitle {
            font-size: 13px !important;
          }
          .footer-heading {
            font-size: 14px !important;
            margin-bottom: 8px !important;
            text-align: left !important;
          }
          .footer-link {
            font-size: 13px !important;
            text-align: left !important;
            display: block !important;
            margin-bottom: 6px !important;
          }
          .footer-bottom {
            padding-top: 16px !important;
            clear: both !important;
          }
          .footer-copyright {
            font-size: 12px !important;
          }
        }`
);

fs.writeFileSync('src/Footer.jsx', content);
console.log('✅ Footer side-by-side layout applied!');
