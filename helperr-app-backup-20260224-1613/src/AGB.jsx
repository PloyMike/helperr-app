import React from 'react';
import Header from './Header';

function AGB() {
  return (
    <div>
      <Header />
      <div style={{ marginTop: 60, padding: '40px 20px', maxWidth: 800, margin: '80px auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 30, color: '#1a202c' }}>
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        <div style={{ lineHeight: 1.8, color: '#4a5568' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 30, marginBottom: 15, color: '#2d3748' }}>
            1. Geltungsbereich
          </h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die zwischen Helperr 
            (Ploy TIBOR) und den Nutzern der Plattform geschlossen werden. Helperr stellt eine Vermittlungsplattform 
            zur Verfügung, über die Dienstleister und Kunden in Kontakt treten können.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            2. Vertragsgegenstand
          </h2>
          <p>
            Helperr ist eine Online-Plattform, die es registrierten Nutzern ermöglicht, Dienstleistungen 
            anzubieten oder nachzufragen. Helperr selbst erbringt keine Dienstleistungen, sondern vermittelt 
            lediglich den Kontakt zwischen Dienstleistern und Kunden.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            3. Registrierung und Nutzerkonto
          </h2>
          
          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            3.1 Registrierung
          </h3>
          <p>
            Die Nutzung bestimmter Funktionen der Plattform erfordert eine Registrierung. Bei der Registrierung 
            sind wahrheitsgemäße und vollständige Angaben zu machen. Der Nutzer ist verpflichtet, seine 
            Registrierungsdaten aktuell zu halten.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            3.2 Nutzerkonto
          </h3>
          <p>
            Nach erfolgreicher Registrierung erhält der Nutzer Zugang zu seinem persönlichen Nutzerkonto. 
            Die Zugangsdaten sind vertraulich zu behandeln und vor dem Zugriff Dritter zu schützen.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            4. Pflichten der Dienstleister
          </h2>
          <p>
            Dienstleister verpflichten sich, ihre angebotenen Dienstleistungen gewissenhaft und fachgerecht 
            zu erbringen. Die Preisgestaltung und die Konditionen der Dienstleistung liegen in der 
            Verantwortung des jeweiligen Dienstleisters.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            5. Pflichten der Kunden
          </h2>
          <p>
            Kunden verpflichten sich, die vereinbarten Zahlungen pünktlich zu leisten und die Dienstleister 
            respektvoll zu behandeln. Buchungen sind verbindlich.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            6. Zahlungsbedingungen
          </h2>
          <p>
            Die Zahlung für Dienstleistungen erfolgt direkt zwischen Kunde und Dienstleister. Helperr kann 
            als Zahlungsabwickler fungieren. Die Details der Zahlungsabwicklung werden bei Buchung festgelegt.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            7. Haftung
          </h2>
          
          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            7.1 Haftung von Helperr
          </h3>
          <p>
            Helperr haftet nicht für die Qualität, Sicherheit oder Rechtmäßigkeit der über die Plattform 
            angebotenen Dienstleistungen. Die Haftung beschränkt sich auf die Vermittlungstätigkeit. Helperr 
            haftet nur bei Vorsatz und grober Fahrlässigkeit.
          </p>

          <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 25, marginBottom: 10, color: '#2d3748' }}>
            7.2 Haftung der Nutzer
          </h3>
          <p>
            Die Nutzer haften für alle Schäden, die durch die Verletzung ihrer Pflichten aus diesen AGB 
            entstehen. Insbesondere haften Dienstleister für die ordnungsgemäße Erbringung ihrer Dienstleistungen.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            8. Bewertungen und Rezensionen
          </h2>
          <p>
            Nutzer können Bewertungen und Rezensionen zu erbrachten Dienstleistungen abgeben. Diese müssen 
            wahrheitsgemäß sein und dürfen keine beleidigenden oder diffamierenden Inhalte enthalten. 
            Helperr behält sich das Recht vor, unangemessene Bewertungen zu löschen.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            9. Kündigung
          </h2>
          <p>
            Nutzer können ihr Konto jederzeit kündigen. Helperr kann Nutzerkonten bei Verstößen gegen diese 
            AGB sperren oder löschen. Eine außerordentliche Kündigung aus wichtigem Grund bleibt unberührt.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            10. Datenschutz
          </h2>
          <p>
            Die Erhebung, Verarbeitung und Nutzung personenbezogener Daten erfolgt gemäß unserer 
            Datenschutzerklärung. Diese ist unter{' '}
            <a href="/datenschutz" style={{ color: '#667eea' }}>www.helperr.app/datenschutz</a> abrufbar.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            11. Streitbeilegung
          </h2>
          <p>
            Bei Streitigkeiten zwischen Dienstleistern und Kunden bietet Helperr Unterstützung bei der 
            Vermittlung. Eine rechtliche Verpflichtung zur Streitschlichtung besteht jedoch nicht.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            12. Änderungen der AGB
          </h2>
          <p>
            Helperr behält sich das Recht vor, diese AGB jederzeit zu ändern. Nutzer werden über wesentliche 
            Änderungen informiert. Die fortgesetzte Nutzung der Plattform nach einer Änderung gilt als 
            Zustimmung zu den geänderten AGB.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 40, marginBottom: 15, color: '#2d3748' }}>
            13. Schlussbestimmungen
          </h2>
          <p>
            Es gilt thailändisches Recht unter Ausschluss des UN-Kaufrechts. Sollten einzelne Bestimmungen 
            dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
          </p>

          <p style={{ marginTop: 40, paddingTop: 30, borderTop: '1px solid #e2e8f0' }}>
            <strong>Kontakt:</strong><br />
            Ploy TIBOR<br />
            E-Mail: <a href="mailto:helperrapp@gmail.com" style={{ color: '#667eea' }}>helperrapp@gmail.com</a>
          </p>

          <p style={{ marginTop: 20, fontSize: 14, color: '#718096' }}>
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

export default AGB;
