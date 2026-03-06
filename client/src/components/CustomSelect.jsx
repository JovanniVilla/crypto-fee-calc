import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomSelect = ({ value, onChange, options, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className="select-wrapper" style={{ position: 'relative' }} ref={containerRef}>
            <div 
                className={`glass-input ${disabled ? 'disabled' : ''}`}
                style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    userSelect: 'none',
                    opacity: disabled ? 0.6 : 1
                }}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', overflow: 'hidden', flex: 1 }}>
                    {selectedOption ? (
                        <>
                            <span style={{ 
                                fontWeight: '500', 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                maxWidth: selectedOption.subLabel ? '60%' : '100%'
                            }}>
                                {selectedOption.label}
                            </span>
                            {selectedOption.subLabel && (
                                <span style={{ 
                                    fontSize: '0.8rem', 
                                    color: 'rgba(255,255,255,0.5)', 
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden', 
                                    textOverflow: 'ellipsis',
                                    flexShrink: 1
                                }}>
                                    · {selectedOption.subLabel.toLowerCase()}
                                </span>
                            )}
                        </>
                    ) : (
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>{placeholder}</span>
                    )}
                </div>
                <ChevronDown 
                    size={16} 
                    style={{ 
                        opacity: 0.7, 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                    }} 
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            background: 'rgba(20, 20, 30, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            maxHeight: '250px',
                            overflowY: 'auto',
                            zIndex: 50,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                        }}
                    >
                        {options.length === 0 ? (
                            <div style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', textAlign: 'center' }}>
                                No options available
                            </div>
                        ) : (
                            options.map((opt) => (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    style={{
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        background: value === opt.value ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                                        transition: 'background 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (value !== opt.value) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (value !== opt.value) e.currentTarget.style.background = 'transparent';
                                    }}
                                >
                                    <span style={{ fontWeight: value === opt.value ? '600' : '400' }}>
                                        {opt.label}
                                    </span>
                                    {opt.subLabel && (
                                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textAlign: 'right' }}>
                                            {opt.subLabel.toLowerCase()}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomSelect;
