import React, { useState } from 'react';
import './styles/index.css';
import FeeCalculator from './components/FeeCalculator';
import DisclaimerModal from './components/DisclaimerModal';

function App() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="container">
      <header className="flex-center" style={{ flexDirection: 'column', marginBottom: '3rem' }}>
        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
          <img src="/logo-crypto-calc.svg" alt="Crypto Fee Calc Logo" style={{ height: '50px', width: 'auto' }} />
          <h1 style={{ fontSize: '2.5rem' }}>Crypto <span className="text-gradient">Fee Calculator</span></h1>
        </div>
        <p style={{ opacity: 0.8 }}>Real-time transaction cost estimations</p>
      </header>

      <main className="flex-center">
        <FeeCalculator />
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.8, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          powered by <a href="https://www.3cuartos.mx" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>3cuartos.mx</a>
        </div>
        <div>
          <button
            onClick={() => setShowDisclaimer(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.8rem',
              opacity: 0.4
            }}
          >
            Descargo de Responsabilidad (Disclaimer)
          </button>
        </div>
      </footer>

      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />
    </div>
  );
}

export default App;
