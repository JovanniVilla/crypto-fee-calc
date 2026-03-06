import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AmountInput = ({ value, onChange, tokenSymbol, tokenPrice }) => {
    const [mode, setMode] = useState('tokens'); // 'tokens' | 'usd'
    const [inputValue, setInputValue] = useState('');

    // Update local input value when internal value (tokens) changes from parent
    // BUT only if not currently editing (to avoid cursor jumps/formatting issues while typing)
    // detailed syncing logic is needed here to prevent loops

    // Strategy: 
    // - "value" prop is always source of truth in TOKENS.
    // - "inputValue" is what the user sees.
    // - When mode changes, we recalculate inputValue.
    // - When prop "value" changes significantly (e.g. preset loaded), we update inputValue.

    useEffect(() => {
        if (!value) {
            setInputValue('');
            return;
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        if (mode === 'tokens') {
            // If parent value updates and we are in tokens mode, sync directly UNLESS it matches current input
            // (simple equality check prevents some loops, but for typing we might need more robust handling if parent modifies it)
            // For now, simple sync:
            if (parseFloat(inputValue) !== numValue) {
                setInputValue(value.toString());
            }
        } else {
            // If mode is USD, we need to convert the incoming token value to USD to show it
            const usdVal = numValue * (tokenPrice || 0);
            // Avoid overwriting user input if calculation is close enough (updates from other sources)
            // This is tricky. For this MVP, we notice that onChange updates parent, which updates prop.
            // If we re-calculate from prop, we might get floating point diffs.
            // We will suppress update if difference is negligible.
            const currentInputUsd = parseFloat(inputValue);
            if (Math.abs(currentInputUsd - usdVal) > 0.0001) {
                setInputValue(usdVal.toFixed(2));
            }
        }
    }, [value, mode]); // removed tokenPrice to avoid jitter on minor price updates, though ideal app would handle it.

    const handleModeToggle = () => {
        const newMode = mode === 'tokens' ? 'usd' : 'tokens';
        setMode(newMode);

        // Convert current visible input to new mode
        if (!inputValue || !tokenPrice) {
            setInputValue('');
            return;
        }

        const currentVal = parseFloat(inputValue);
        if (newMode === 'usd') {
            // Switch TO USD: Tokens * Price
            setInputValue((currentVal * tokenPrice).toFixed(2));
        } else {
            // Switch TO Tokens: USD / Price
            // Use high precision for tokens
            setInputValue((currentVal / tokenPrice).toFixed(6));
        }
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setInputValue(val);

        if (val === '') {
            onChange('');
            return;
        }

        const numVal = parseFloat(val);
        if (isNaN(numVal)) return;

        if (mode === 'tokens') {
            onChange(val); // Propagate token amount directly
        } else {
            // Convert USD to Tokens
            if (tokenPrice && tokenPrice > 0) {
                const tokens = numVal / tokenPrice;
                onChange(tokens.toString());
            }
        }
    };

    const getSubtitle = () => {
        if (!inputValue || !tokenPrice) return null;
        const numVal = parseFloat(inputValue);
        if (isNaN(numVal)) return null;

        if (mode === 'tokens') {
            // Show USD equivalent
            const usd = numVal * tokenPrice;
            return `≈ $${usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            // Show Token equivalent
            const tokens = numVal / tokenPrice;
            return `≈ ${tokens.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${tokenSymbol || ''}`;
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem' }}>Amount</label>

                {/* Toggle Switch */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    padding: '2px',
                    fontSize: '0.75rem'
                }}>
                    <button
                        onClick={() => mode !== 'tokens' && handleModeToggle()}
                        style={{
                            background: mode === 'tokens' ? 'var(--accent-color)' : 'transparent',
                            color: mode === 'tokens' ? 'white' : 'rgba(255,255,255,0.6)',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        Tokens
                    </button>
                    <button
                        onClick={() => mode !== 'usd' && handleModeToggle()}
                        style={{
                            background: mode === 'usd' ? 'var(--accent-color)' : 'transparent',
                            color: mode === 'usd' ? 'white' : 'rgba(255,255,255,0.6)',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '2px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        USD
                    </button>
                </div>
            </div>

            <div style={{ position: 'relative' }}>
                <input
                    type="number"
                    className="glass-input"
                    placeholder="0.00"
                    value={inputValue}
                    onChange={handleChange}
                    style={{ paddingRight: '60px' }} // Space for unit label if needed
                />
                {/* Unit Label inside input */}
                <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255,255,255,0.5)',
                    pointerEvents: 'none',
                    fontSize: '0.8rem'
                }}>
                    {mode === 'tokens' ? (tokenSymbol || '') : 'USD'}
                </span>
            </div>

            {/* Subtitle Conversion */}
            <div style={{
                marginTop: '4px',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                minHeight: '1.2em'
            }}>
                {getSubtitle()}
            </div>
        </div>
    );
};

export default AmountInput;
