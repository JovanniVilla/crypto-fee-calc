import React, { useState } from 'react';
import './styles/index.css';
import FeeCalculator from './components/FeeCalculator';
import { motion, AnimatePresence } from 'framer-motion';

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
              opacity: 0.7
            }}
          >
            Descargo de Responsabilidad (Disclaimer)
          </button>
        </div>
      </footer>

      <AnimatePresence>
        {showDisclaimer && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowDisclaimer(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                backgroundColor: '#1a1a2e',
                padding: '30px',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', color: 'var(--accent-color)' }}>Descargo de Responsabilidad (Disclaimer)</h2>
              <div style={{ fontSize: '0.95rem', lineHeight: '1.6', opacity: 0.9, maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                <p style={{ marginBottom: '15px' }}>
                  La información proporcionada por Crypto Fee Calculator tiene un propósito meramente informativo y educativo. Aunque nos esforzamos por mantener la precisión y exactitud de nuestros cálculos, las comisiones (fees) en el mundo de las criptomonedas son dinámicas y pueden variar rápidamente debido a factores externos como la congestión de la red, los cambios en las tarifas de los exchanges o la volatilidad del mercado.
                </p>
                <p style={{ marginBottom: '15px' }}>
                  Por lo tanto, Crypto Fee Calculator no garantiza la exactitud absoluta de los resultados obtenidos y no se responsabiliza por posibles errores en los cálculos, ni por las decisiones financieras o las pérdidas económicas derivadas del uso de esta herramienta. Los valores mostrados son representativos y aproximados, y pueden no reflejar fielmente los valores reales al momento de ejecutar una transacción. El usuario es el único responsable de verificar los datos y las comisiones reales con las fuentes oficiales o las plataformas de intercambio correspondientes antes de realizar cualquier operación. El uso de esta plataforma implica la aceptación de este descargo de responsabilidad.
                </p>
              </div>
              <button 
                onClick={() => setShowDisclaimer(false)}
                style={{ 
                  marginTop: '25px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
