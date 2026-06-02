import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import Header from './Header';

function MyPayments() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [payoutData, setPayoutData] = useState({
    bank_brand: '',
    bank_account_number: '',
    bank_account_name: '',
    omise_recipient_id: null,
    verified: false,
  });
  const [savingPayout, setSavingPayout] = useState(false);
  const [refreshingPayout, setRefreshingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  // Profil laden
  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();
      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Payout-Account laden
  useEffect(() => {
    const loadPayout = async () => {
      if (!profile?.id) return;
      const { data, error } = await supabase
        .from('provider_payout_accounts')
        .select('*')
        .eq('profile_id', profile.id)
        .maybeSingle();
      if (error) {
        console.error('Payout load error:', error);
        return;
      }
      if (data) {
        setPayoutData({
          bank_brand: data.bank_brand || '',
          bank_account_number: data.bank_account_number || '',
          bank_account_name: data.bank_account_name || '',
          omise_recipient_id: data.omise_recipient_id || null,
          verified: !!data.verified,
        });
      }
    };
    loadPayout();
  }, [profile?.id]);

  const handleSavePayout = async () => {
    setPayoutError('');
    const { bank_brand, bank_account_number, bank_account_name } = payoutData;
    if (!bank_brand) { setPayoutError('Please select your bank'); return; }
    if (!bank_account_number || !/^\d{6,15}$/.test(bank_account_number)) {
      setPayoutError('Account number must be 6-15 digits'); return;
    }
    if (!bank_account_name || bank_account_name.trim().length < 2) {
      setPayoutError('Please enter the account holder name'); return;
    }
    if (!profile?.id) { setPayoutError('Profile not loaded'); return; }

    setSavingPayout(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/omise-create-recipient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          profileId: profile.id,
          bankBrand: bank_brand,
          accountNumber: bank_account_number.trim(),
          accountName: bank_account_name.trim(),
          email: profile.email || '',
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to save payout account');
      }
      setPayoutData(prev => ({ ...prev, omise_recipient_id: result.recipient_id }));
      alert('Payout account saved successfully!');
    } catch (err) {
      console.error('Save payout error:', err);
      setPayoutError(err.message || 'Failed to save payout account');
    } finally {
      setSavingPayout(false);
    }
  };

  const handleRefreshPayoutStatus = async () => {
    if (!profile?.id || !payoutData.omise_recipient_id) return;
    setPayoutError('');
    setRefreshingPayout(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('https://jyuatojpkluyidpefzub.supabase.co/functions/v1/omise-refresh-recipient-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ profileId: profile.id }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to refresh status');
      }
      setPayoutData(prev => ({ ...prev, verified: !!result.verified }));
      if (result.failure_code) {
        setPayoutError(`Verification failed: ${result.failure_code}`);
      }
    } catch (err) {
      console.error('Refresh status error:', err);
      setPayoutError(err.message || 'Failed to refresh status');
    } finally {
      setRefreshingPayout(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />
        <div style={styles.loading}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  // === Kein Profil = Kunde, noch kein Expert ===
  if (!profile) {
    return (
      <div style={styles.app}>
        <Header transparent={true} />

        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <h1 style={styles.heroTitle}>Payment</h1>
            <p style={styles.heroSub}>Manage your payout account and earnings</p>
          </div>
        </div>

        <div style={styles.becomeExpert}>
          <div style={styles.becomeCard}>
            <div style={styles.becomeIcon}>🚀</div>
            <h2 style={styles.becomeTitle}>You are not yet an expert</h2>
            <p style={styles.becomeText}>
              Create your expert profile to receive bookings and payouts on Helperr.
            </p>
            <button onClick={() => window.navigateTo('signup')} style={styles.becomeBtn}>
              Become an Expert
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === Expert: zeig Payout-Account ===
  return (
    <div style={styles.app}>
      <Header transparent={true} />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Payment</h1>
          <p style={styles.heroSub}>Manage your payout account and earnings</p>
        </div>
      </div>

      <div style={styles.container}>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Payout Account 🏦</h3>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', marginBottom: 20, fontSize: 13, lineHeight: 1.5, color: '#065f46' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>💡 How payouts work</div>
            Connect your Thai bank account to receive payments. After a completed service, payouts arrive in your bank account within <strong>7-8 days</strong> (Omise processing time). You can update these details anytime.
          </div>

          {!payoutData.omise_recipient_id && (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
              ⚠️ <strong>No payout account connected.</strong> You can still receive bookings, but payments will be held until you connect a bank account.
            </div>
          )}

          {payoutData.omise_recipient_id && payoutData.verified && (
            <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#065f46' }}>
              ✓ <strong>Payout account verified.</strong> You're ready to receive payments.
            </div>
          )}

          {payoutData.omise_recipient_id && !payoutData.verified && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 14px', marginBottom: 20, fontSize: 13, color: '#1e40af' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  ⏳ <strong>Pending verification by Omise.</strong> This usually takes 1-2 business days.
                </div>
                <button
                  type="button"
                  onClick={handleRefreshPayoutStatus}
                  disabled={refreshingPayout}
                  style={{ background: '#1e40af', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: refreshingPayout ? 'not-allowed' : 'pointer', opacity: refreshingPayout ? 0.6 : 1, whiteSpace: 'nowrap' }}
                >
                  {refreshingPayout ? 'Checking...' : 'Refresh status'}
                </button>
              </div>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Bank</label>
            <select
              value={payoutData.bank_brand}
              onChange={(e) => setPayoutData({...payoutData, bank_brand: e.target.value})}
              style={styles.input}
            >
              <option value="">— Select your bank —</option>
              <option value="bbl">Bangkok Bank</option>
              <option value="kbank">Kasikorn Bank (K-Bank)</option>
              <option value="ktb">Krung Thai Bank</option>
              <option value="scb">Siam Commercial Bank (SCB)</option>
              <option value="bay">Krungsri (Bank of Ayudhya)</option>
              <option value="ttb">TMBThanachart (TTB)</option>
              <option value="uob">UOB</option>
              <option value="cimb">CIMB Thai</option>
              <option value="gsb">Government Savings Bank (GSB)</option>
              <option value="kk">Kiatnakin Phatra (KKP)</option>
              <option value="tisco">Tisco</option>
              <option value="lh">Land and Houses Bank (LH)</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Account Number</label>
            <input
              type="text"
              inputMode="numeric"
              value={payoutData.bank_account_number}
              onChange={(e) => setPayoutData({...payoutData, bank_account_number: e.target.value.replace(/\D/g, '')})}
              placeholder="6-15 digits, no spaces"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Account Holder Name</label>
            <input
              type="text"
              value={payoutData.bank_account_name}
              onChange={(e) => setPayoutData({...payoutData, bank_account_name: e.target.value})}
              placeholder="As shown on your bank account"
              style={styles.input}
            />
          </div>

          {payoutError && (
            <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
              {payoutError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSavePayout}
            disabled={savingPayout}
            style={{...styles.btnPrimary, opacity: savingPayout ? 0.6 : 1, cursor: savingPayout ? 'not-allowed' : 'pointer'}}
          >
            {savingPayout ? 'Saving...' : (payoutData.omise_recipient_id ? 'Update Payout Account' : 'Save Payout Account')}
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Earnings History</h3>
          <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 10, padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
            📊 Coming soon — your payout history will appear here.
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#6b7280' },
  container: { maxWidth: 720, margin: '0 auto', padding: '40px 20px' },
  hero: { background: 'linear-gradient(135deg, #065f46 0%, #047857 40%, #0f766e 70%, #14b8a6 100%)', padding: '120px 20px 64px', marginBottom: 40, position: 'relative', overflow: 'hidden', clipPath: 'ellipse(120% 100% at 50% 0%)' },
  heroInner: { maxWidth: 800, margin: '0 auto', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: 42, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' },
  heroSub: { color: '#d1fae5', fontSize: 16, margin: 0 },
  section: { background: 'white', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  sectionTitle: { margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1F2937' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  btnPrimary: { background: '#065f46', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%' },
  becomeExpert: { maxWidth: 720, margin: '0 auto', padding: '40px 20px' },
  becomeCard: { background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  becomeIcon: { fontSize: 48, marginBottom: 16 },
  becomeTitle: { fontSize: 24, fontWeight: 700, color: '#1F2937', margin: '0 0 12px 0' },
  becomeText: { fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: '0 0 24px 0' },
  becomeBtn: { background: '#065f46', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
};

export default MyPayments;
