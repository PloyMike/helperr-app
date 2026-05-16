import React from 'react';
import Header from './Header';

function Impressum() {
  return (
    <div>
      <Header />
      <div style={{ marginTop: 60, padding: '40px 20px', maxWidth: 800, margin: '80px auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 30, color: '#1a202c' }}>
          Impressum
        </h1>

        <div style={{ lineHeight: 1.8, color: '#4a5568' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 30, marginBottom: 15, color: '#2d3748' }}>
            Angaben gemäß § 5 TMG
          </h2>
          
          <p><strong>Betreiber:</strong></p>
          <p>
            Ploy TIBOR<br />
            67/3 Moo 1, Bophut<br />
            Koh Samui, 84320<br />
            Surat Thani, Thailand
          </p>

          <p style={{ marginTop: 20 }}>
            <strong>Kontakt:</strong><br />
            E-Mail: <a href="mailto:helperrapp@gmail.com" style={{ color: '#667eea' }}>helperrapp@gmail.com</a>
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            Haftungsausschluss
          </h2>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            Haftung für Inhalte
          </h3>
          <p>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
            Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
            nach den allgemeinen Gesetzen verantwortlich.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            Haftung für Links
          </h3>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
            Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
            Seiten verantwortlich.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            Urheberrecht
          </h3>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
            dem thailändischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede 
            Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
            Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>

          <p style={{ marginTop: 30, fontSize: 14, color: '#718096' }}>
            Stand: {new Date().toLocaleDateString('de-DE')}
          </p>

          <div style={{ marginTop: 40 }}>
            <a 
              href="/"
              style={{
                display: 'inline-block',
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 600
              }}
            >
              ← Zurück zur Startseite
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Impressum;
