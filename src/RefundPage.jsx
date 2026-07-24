import React from 'react';
import LegalPage from './LegalPage';

function RefundPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <p><strong>Last Updated:</strong> July 21, 2026</p>
      <p>Helperr operates a fair payment model: customers are only charged when the booked expert actually arrives and starts the service.</p>

      <h2 style={{ marginTop: 40, fontSize: 24, fontWeight: 700, color: '#111827' }}>1. How Payment Works</h2>
      <p>Your card is authorized at the time of booking, but the charge is only completed when the expert confirms arrival. If the expert does not arrive, no charge is made.</p>

      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>2. Cancellations</h2>
      <p><strong>Before the expert arrives:</strong> You may cancel your booking at any time without charge.</p>
      <p><strong>After the expert arrives:</strong> The service is considered started and standard fees apply.</p>

      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>3. Refunds</h2>
      <p>If the delivered service does not match what was agreed (unsatisfactory quality, wrong service, incomplete work, etc.), you may request a refund within 48 hours of the service completion.</p>
      <p>Refund requests are reviewed by our support team within 3 business days. Approved refunds are returned to the original payment method within 5-10 business days.</p>

      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>4. Service Fees</h2>
      <p>Helperr retains a 9% service fee from all completed transactions. This fee covers platform maintenance, expert verification, and customer support.</p>

      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>5. Payment Processing Fees</h2>
      <p>All payment processing fees (credit card charges, PromptPay fees, etc.) are covered by Helperr — not by the customer or the expert.</p>

      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>6. Non-Refundable Situations</h2>
      <ul style={{ marginLeft: 20, lineHeight: 1.8 }}>
        <li><strong>Customer no-show:</strong> If the customer is not present at the agreed location at the agreed time.</li>
        <li><strong>Cancellation after expert arrival:</strong> Once the expert has arrived and started the service.</li>
        <li><strong>Services fully delivered as described:</strong> If the service was delivered as agreed, no refund applies.</li>
      </ul>

      <h2 style={{ marginTop: 32, fontSize: 24, fontWeight: 700, color: '#111827' }}>7. Contact</h2>
      <p>For refund requests, disputes, or questions about this policy, please contact us:</p>
      <p>Email: <a href="mailto:support@helperr.co" style={{ color: '#065f46' }}>support@helperr.co</a></p>
      <p>Or use the "Contact Us" page in the app.</p>
    </LegalPage>
  );
}

export default RefundPage;
