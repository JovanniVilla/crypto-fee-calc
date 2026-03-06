import React from 'react';
import './styles/index.css';
import { Layers } from 'lucide-react';
import FeeCalculator from './components/FeeCalculator';

function App() {
  return (
    <div className="container">
      <header className="flex-center" style={{ flexDirection: 'column', marginBottom: '3rem' }}>
        <div className="flex-center" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
          <Layers size={32} color="#60a5fa" />
          <h1 style={{ fontSize: '2.5rem' }}>Crypto <span className="text-gradient">Fee Calculator</span></h1>
        </div>
        <p style={{ opacity: 0.8 }}>Real-time transaction cost estimations</p>
      </header>

      <main className="flex-center">
        <FeeCalculator />
      </main>
    </div>
  );
}

export default App;
