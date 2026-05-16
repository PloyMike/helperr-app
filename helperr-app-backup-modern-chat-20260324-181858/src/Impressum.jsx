import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Impressum() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      <Header />
      
      <div style={{ paddingTop: 90, paddingBottom: 60 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
          
          <h1 style={{ 
            fontSize: 42, 
            fontWeight: 800, 
            marginBottom: 12, 
            color: '#1F2937',
            fontFamily: '"Outfit", sans-serif'
          }}>
            Impressum
          </h1>
          
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 40, fontFamily: '"Outfit", sans-serif' }}>
            Angaben gemäß § 5 TMG
          </p>

          <div style={{ 
            background: 'white', 
            padding: 40, 
            borderRadius: 16, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            lineHeight: 1.8,
            fontFamily: '"Outfit", sans-serif'
          }}>
            
            <h2 style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              marginBottom: 20, 
              color: '#1F2937' 
            }}>
              Betreiber
            </h2>
            
            <p style={{ color: '#374151', marginBottom: 8 }}>
              <strong>Helperr Platform</strong>
            </p>
            <p style={{ color: '#6B7280', marginBottom: 24 }}>
              Southeast Asia
            </p>

            <h2 style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              marginTop: 40, 
              marginBottom: 20, 
              color: '#1F2937' 
            }}>
              Kontakt
            </h2>
            
            <p style={{ color: '#374151' }}>
              E-Mail: <a 
                href="mailto:helperrapp@gmail.com" 
                style={{ 
                  color: '#14B8A6', 
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                helperrapp@gmail.com
              </a>
            </p>

            <h2 style={{ 
              fontSize: 24, 
              fontWeight: 700, 
              marginTop: 40, 
              marginBottom: 20, 
              color: '#1F2937' 
            }}>
              Haftungsausschluss
            </h2>

            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              marginTop: 25, 
              marginBottom: 12, 
              color: '#374151' 
            }}>
              Haftung für Inhalte
            </h3>
            <p style={{ color: '#6B7280', marginBottom: 20 }}>
              Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
              Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
              nach den allgemeinen Gesetzen verantwortlich.
            </p>

            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              marginTop: 25, 
              marginBottom: 12, 
              color: '#374151' 
            }}>
              Haftung für Links
            </h3>
            <p style={{ color: '#6B7280', marginBottom: 20 }}>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
              Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
              Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber 
              der Seiten verantwortlich.
            </p>

            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 600, 
              marginTop: 25, 
              marginBottom: 12, 
              color: '#374151' 
            }}>
              Urheberrecht
            </h3>
            <p style={{ color: '#6B7280' }}>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
              dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
              der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
              Zustimmung des jeweiligen Autors bzw. Erstellers.
            </p>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Impressum;
