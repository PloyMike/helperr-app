const fs = require('fs');
let content = fs.readFileSync('src/Helperr.jsx', 'utf8');

const filterStyles = `
        .advanced-filters {
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-top: 24px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          align-items: end;
        }
        .filter-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .filter-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          font-family: "Outfit", sans-serif;
        }
        .price-inputs {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .price-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          font-family: "Outfit", sans-serif;
          outline: none;
          transition: all 0.2s;
        }
        .price-input:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .price-separator {
          color: #9CA3AF;
          font-weight: 600;
        }
        .city-select {
          padding: 10px 14px;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          font-size: 14px;
          font-family: "Outfit", sans-serif;
          outline: none;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .city-select:focus {
          border-color: #14B8A6;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .rating-buttons {
          display: flex;
          gap: 8px;
        }
        .rating-btn {
          flex: 1;
          padding: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rating-btn:hover {
          border-color: #14B8A6;
          background: #F0FDFA;
        }
        .rating-btn.active {
          background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%);
          color: white;
          border-color: #14B8A6;
        }
        .reset-filters-btn {
          padding: 10px 20px;
          background: #F3F4F6;
          color: #374151;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          font-family: "Outfit", sans-serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reset-filters-btn:hover {
          background: #E5E7EB;
        }
        @media (max-width: 768px) {
          .advanced-filters {
            grid-template-columns: 1fr;
            padding: 16px;
            margin-top: 16px;
            gap: 16px;
          }
          .rating-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
        }`;

// Füge Styles vor dem letzten </style> ein
content = content.replace(
  /(\}\)\}\s*<\/style>)/,
  `${filterStyles}\n$1`
);

fs.writeFileSync('src/Helperr.jsx', content);
console.log('✅ Filter styles added!');
