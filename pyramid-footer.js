const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Update Mobile Styles für Pyramiden-Layout
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
            align-items: center !important;
            gap: 24px !important;
            margin-bottom: 20px !important;
          }
          /* Section 1: Helperr - Zentriert */
          .footer-section:nth-child(1) {
            text-align: center !important;
            width: 100% !important;
          }
          /* Section 2: Unternehmen - Etwas rechts */
          .footer-section:nth-child(2) {
            text-align: center !important;
            width: 80% !important;
            margin-left: 10% !important;
          }
          /* Section 3: Support - Noch mehr rechts */
          .footer-section:nth-child(3) {
            text-align: center !important;
            width: 60% !important;
            margin-left: 20% !important;
          }
          .footer-section {
            gap: 8px !important;
          }
          .footer-title {
            font-size: 20px !important;
          }
          .footer-subtitle {
            font-size: 13px !important;
          }
          .footer-heading {
            font-size: 14px !important;
            margin-bottom: 6px !important;
          }
          .footer-link {
            font-size: 13px !important;
          }
          .footer-bottom {
            padding-top: 16px !important;
          }
          .footer-copyright {
            font-size: 12px !important;
          }
        }`
);

fs.writeFileSync('src/Footer.jsx', content);
console.log('✅ Footer pyramid layout applied!');
