const fs = require('fs');
let content = fs.readFileSync('src/Footer.jsx', 'utf8');

// Update Mobile Styles - 2 Spalten für Unternehmen & Support
content = content.replace(
  /\/\* MOBILE \*\/[\s\S]*?@media \(max-width: 768px\) \{[\s\S]*?\}/,
  `/* MOBILE */
        @media (max-width: 768px) {
          .footer {
            padding: 30px 16px 16px !important;
          }
          .footer-content {
            display: grid !important;
            grid-template-columns: 1fr !important;
            grid-template-areas: 
              "helperr"
              "columns" !important;
            gap: 24px !important;
            margin-bottom: 20px !important;
          }
          /* Helperr - Oben zentriert */
          .footer-section:nth-child(1) {
            grid-area: helperr !important;
            text-align: center !important;
          }
          /* Container für Unternehmen & Support */
          .footer-section:nth-child(2),
          .footer-section:nth-child(3) {
            display: inline-block !important;
            width: 50% !important;
            vertical-align: top !important;
            text-align: left !important;
            padding: 0 10px !important;
            box-sizing: border-box !important;
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
            margin-bottom: 8px !important;
            text-align: left !important;
          }
          .footer-link {
            font-size: 13px !important;
            text-align: left !important;
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
console.log('✅ Footer 2-column layout applied!');
