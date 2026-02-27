import React from 'react';

function AdvancedFilters({ filters, setFilters, onReset }) {
  const handlePriceChange = (e, type) => {
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: parseInt(e.target.value)
      }
    });
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: 12,
      border: '1px solid #e2e8f0',
      marginBottom: 20
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#2d3748' }}>
          🔍 Erweiterte Filter
        </h3>
        <button
          onClick={onReset}
          style={{
            padding: '6px 16px',
            backgroundColor: '#f7fafc',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Filter zurücksetzen
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
        {/* Price Range */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: '#2d3748' }}>
            💰 Preis pro Stunde
          </label>
          <div style={{ marginBottom: 8 }}>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange(e, 'min')}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#718096' }}>
              <span>Min: {filters.priceRange.min}€</span>
            </div>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange(e, 'max')}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#718096' }}>
              <span>Max: {filters.priceRange.max}€</span>
            </div>
          </div>
        </div>

        {/* Min Rating */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: '#2d3748' }}>
            ⭐ Mindest-Bewertung
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 14,
              backgroundColor: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="0">Alle Bewertungen</option>
            <option value="3">3+ Sterne</option>
            <option value="3.5">3.5+ Sterne</option>
            <option value="4">4+ Sterne</option>
            <option value="4.5">4.5+ Sterne</option>
            <option value="5">Nur 5 Sterne</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, fontSize: 14, color: '#2d3748' }}>
            ✅ Verfügbarkeit
          </label>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
            padding: '10px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            backgroundColor: filters.availableOnly ? '#edf2f7' : 'white',
            transition: 'all 0.2s'
          }}>
            <input
              type="checkbox"
              checked={filters.availableOnly}
              onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
              style={{ width: 18, height: 18, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 14, color: '#2d3748' }}>
              Nur verfügbare Helfer
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.priceRange.min > 0 || filters.priceRange.max < 200 || filters.minRating > 0 || filters.availableOnly) && (
        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#edf2f7',
          borderRadius: 8,
          fontSize: 13,
          color: '#4a5568'
        }}>
          <strong>Aktive Filter:</strong>
          {' '}
          {filters.priceRange.min > 0 || filters.priceRange.max < 200 ? `Preis ${filters.priceRange.min}€-${filters.priceRange.max}€` : ''}
          {filters.minRating > 0 ? ` • Min. ${filters.minRating}⭐` : ''}
          {filters.availableOnly ? ' • Nur Verfügbare' : ''}
        </div>
      )}
    </div>
  );
}

export default AdvancedFilters;
