import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      
      <div className="footer-content">
        <div className="footer-section">
          <h2 className="footer-title">Helperr</h2>
          <p className="footer-subtitle">Deine Plattform für lokale Dienstleistungen</p>
        </div>

        <div className="footer-columns">
          <div className="footer-section">
            <h3 className="footer-heading">Unternehmen</h3>
            <button onClick={()=>window.navigateTo('impressum')} className="footer-link">Impressum</button>
            <button onClick={()=>window.navigateTo('datenschutz')} className="footer-link">Datenschutz</button>
            <button onClick={()=>window.navigateTo('agb')} className="footer-link">AGB</button>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Support</h3>
            <button onClick={()=>window.navigateTo('kontakt')} className="footer-link">Kontakt</button>
            <button onClick={()=>window.navigateTo('faq')} className="footer-link">FAQ</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">© 2024 Helperr. Alle Rechte vorbehalten.</p>
      </div>

      <style>{`
        .footer {
          background-color: #1F2937;
          color: white;
          padding: 50px 20px 20px;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .footer-columns {
          display: contents;
        }
        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-title {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 8px;
          font-family: "Outfit", sans-serif;
          background: linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer-subtitle {
          font-size: 15px;
          color: #9CA3AF;
          font-family: "Outfit", sans-serif;
          line-height: 1.5;
        }
        .footer-heading {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 12px;
          font-family: "Outfit", sans-serif;
          color: white;
        }
        .footer-link {
          background: none;
          border: none;
          padding: 0;
          margin: 0;
          color: #9CA3AF;
          text-decoration: none;
          font-size: 14px;
          font-family: "Outfit", sans-serif;
          cursor: pointer;
          transition: color 0.2s;
          text-align: left;
          display: block;
          width: 100%;
        }
        .footer-link:hover {
          color: #14B8A6;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .footer-copyright {
          font-size: 13px;
          color: #6B7280;
          text-align: center;
          font-family: "Outfit", sans-serif;
          margin: 0;
        }

        /* MOBILE */
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
          }
          /* Footer Columns Wrapper - 2 Spalten nebeneinander */
          .footer-columns {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
          /* Unternehmen Spalte - Links nach rechts */
          .footer-columns .footer-section:first-child .footer-link {
            padding-left: 45px !important;
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
          }
          .footer-link {
            font-size: 13px !important;
            margin-bottom: 4px !important;
            padding: 0 !important;
            text-align: left !important;
            display: block !important;
          }
          .footer-bottom {
            padding-top: 16px !important;
          }
          .footer-copyright {
            font-size: 12px !important;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
