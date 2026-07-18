import { Capacitor } from '@capacitor/core';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
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

  // Earnings laden: alle captured Buchungen mit echtem service_price
  useEffect(() => {
    const loadEarnings = async () => {
      if (!profile?.id) return;
      setLoadingEarnings(true);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('id, booking_date, customer_name, service_name, service_price, duration_hours, payment_status, payout_status, payout_amount, payout_completed_at, captured_at, created_at')
          .eq('profile_id', profile.id)
          .eq('payment_status', 'captured')
          .not('service_price', 'is', null)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setEarnings(data || []);
      } catch (err) {
        console.error('Earnings load error:', err);
      } finally {
        setLoadingEarnings(false);
      }
    };
    loadEarnings();
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
        <Header transparent={true} isScrolled={isScrolled} />
        <div style={styles.loading}>
          <h2>Loading payments...</h2>
        </div>
      </div>
    );
  }

  // === Kein Profil = Kunde, noch kein Expert ===
  if (!profile) {
    return (
      <div style={styles.app}>
        <Header transparent={true} isScrolled={isScrolled} />

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
      <Header transparent={true} isScrolled={isScrolled} />

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

          {loadingEarnings && (
            <div style={{ padding: 24, textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
              Loading earnings...
            </div>
          )}

          {!loadingEarnings && earnings.length === 0 && (
            <div style={{ background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 10, padding: '24px', textAlign: 'center', color: '#6b7280', fontSize: 14 }}>
              📊 No earnings yet. Once a customer pays for your service, it will show up here.
            </div>
          )}

          {!loadingEarnings && earnings.length > 0 && (() => {
            const totalGross = earnings.reduce((sum, b) => sum + (Number(b.service_price || 0) * Number(b.duration_hours || 1)), 0);
            const totalNet = earnings.reduce((sum, b) => {
              const gross = Number(b.service_price || 0) * Number(b.duration_hours || 1);
              return sum + Math.round(gross * 0.91);
            }, 0);
            const totalPaid = earnings.filter(b => b.payout_status === 'sent').reduce((sum, b) => sum + Number(b.payout_amount || 0), 0);
            const totalPending = totalNet - totalPaid;
            const nowMonth = new Date().toISOString().slice(0, 7);
            const thisMonthNet = earnings.filter(b => (b.booking_date || '').startsWith(nowMonth)).reduce((sum, b) => {
              const gross = Number(b.service_price || 0) * Number(b.duration_hours || 1);
              return sum + Math.round(gross * 0.91);
            }, 0);

            return (
              <>
                <div style={styles.summaryGrid}>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Total earned</div>
                    <div style={styles.summaryValue}>{totalNet.toLocaleString()} THB</div>
                    <div style={styles.summaryHint}>after 9% fee</div>
                  </div>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Pending payout</div>
                    <div style={styles.summaryValue}>{totalPending.toLocaleString()} THB</div>
                    <div style={styles.summaryHint}>{earnings.filter(b => b.payout_status !== 'sent').length} bookings</div>
                  </div>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>This month</div>
                    <div style={styles.summaryValue}>{thisMonthNet.toLocaleString()} THB</div>
                    <div style={styles.summaryHint}>{earnings.filter(b => (b.booking_date || '').startsWith(nowMonth)).length} bookings</div>
                  </div>
                  <div style={styles.summaryCard}>
                    <div style={styles.summaryLabel}>Total bookings</div>
                    <div style={styles.summaryValue}>{earnings.length}</div>
                    <div style={styles.summaryHint}>{earnings.filter(b => b.payout_status === 'sent').length} paid out</div>
                  </div>
                </div>

                <div style={styles.tableWrap}>
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.tr}>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Customer</th>
                        <th style={styles.th}>Service</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Gross</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Fee (9%)</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Net</th>
                        <th style={styles.th}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.map(b => {
                        const gross = Math.round(Number(b.service_price || 0) * Number(b.duration_hours || 1));
                        const net = Math.round(gross * 0.91);
                        const fee = gross - net;
                        const isPaid = b.payout_status === 'sent';
                        let statusLabel = 'Pending payout';
                        let statusColor = '#92400e';
                        let statusBg = '#fef3c7';
                        if (isPaid) {
                          const paidDate = b.payout_completed_at ? new Date(b.payout_completed_at).toLocaleDateString() : '';
                          statusLabel = paidDate ? `Paid ${paidDate}` : 'Paid out';
                          statusColor = '#065f46';
                          statusBg = '#ecfdf5';
                        } else if (b.captured_at) {
                          // Erwarte ~7 Tage nach captured_at
                          const expected = new Date(new Date(b.captured_at).getTime() + 7 * 24 * 60 * 60 * 1000);
                          const daysLeft = Math.max(0, Math.ceil((expected - new Date()) / (24 * 60 * 60 * 1000)));
                          statusLabel = daysLeft > 0 ? `Pending · ~${daysLeft}d` : 'Pending · soon';
                        }
                        return (
                          <tr key={b.id} style={styles.tr}>
                            <td style={styles.td}>{b.booking_date || '—'}</td>
                            <td style={styles.td}>{b.customer_name || '—'}</td>
                            <td style={styles.td}>{b.service_name || '—'}</td>
                            <td style={{...styles.td, textAlign: 'right'}}>{gross.toLocaleString()}</td>
                            <td style={{...styles.td, textAlign: 'right', color: '#9ca3af'}}>−{fee.toLocaleString()}</td>
                            <td style={{...styles.td, textAlign: 'right', fontWeight: 700, color: '#065f46'}}>{net.toLocaleString()}</td>
                            <td style={styles.td}>
                              <span style={{ background: statusBg, color: statusColor, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {statusLabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8, textAlign: 'right' }}>All amounts in THB</div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: { fontFamily: '"Outfit", sans-serif', background: '#f9fafb', minHeight: '100vh', paddingTop: 0 },
  loading: { minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#6b7280' },
  container: { maxWidth: 720, margin: '0 auto', padding: Capacitor.isNativePlatform() ? '20px 20px calc(120px + env(safe-area-inset-bottom)) 20px' : '40px 20px' },
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
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 },
  summaryCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '14px 16px' },
  summaryLabel: { fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 },
  summaryValue: { fontSize: 22, fontWeight: 800, color: '#065f46', lineHeight: 1.2 },
  summaryHint: { fontSize: 11, color: '#9ca3af', marginTop: 4 },
  tableWrap: { overflowX: 'auto', maxHeight: 480, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 12 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 },
  tr: { borderBottom: '1px solid #f3f4f6' },
  th: { background: '#f9fafb', textAlign: 'left', padding: '10px 14px', fontWeight: 700, color: '#374151', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', position: 'sticky', top: 0, zIndex: 1 },
  td: { padding: '10px 14px', color: '#1f2937', whiteSpace: 'nowrap' },
};

export default MyPayments;
