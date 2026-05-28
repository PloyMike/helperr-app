// Währung aus einem Preis-String wie "1000 THB/Hr" auslesen
export function getCurrencyCode(priceText) {
  if (!priceText) return 'THB';
  const m = String(priceText).match(/\d+\s*([A-Za-z]{3})/);
  return m ? m[1].toUpperCase() : 'THB';
}

// Symbol fuer einen Waehrungscode (Fallback: Code selbst)
export function getCurrencySymbol(code) {
  const symbols = {
    THB: '฿', EUR: '€', USD: '$', GBP: '£', JPY: '¥', CNY: '¥',
    AUD: 'A$', CAD: 'C$', HKD: 'HK$', SGD: 'S$', INR: '₹', ILS: '₪',
    CHF: 'CHF', SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł',
    VND: '₫', IDR: 'Rp', PHP: '₱', MYR: 'RM', KRW: '₩',
    AED: 'AED', ARS: '$', BRL: 'R$', CZK: 'Kč', EGP: 'E£', HUF: 'Ft',
  };
  return symbols[code] || (code + ' ');
}
