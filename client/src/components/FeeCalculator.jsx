import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AmountInput from './AmountInput';
import CustomSelect from './CustomSelect';

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5001/api';

const PLATFORMS = [
    { value: 'personal_wallet', label: 'Personal Wallet', subLabel: 'Wallet' },
    { value: 'binance', label: 'Binance', subLabel: 'CEX' },
    { value: 'coinbase', label: 'Coinbase', subLabel: 'CEX' },
    { value: 'kraken', label: 'Kraken', subLabel: 'CEX' },
    { value: 'kucoin', label: 'KuCoin', subLabel: 'CEX' },
    { value: 'bybit', label: 'Bybit', subLabel: 'CEX' },
    { value: 'okx', label: 'OKX', subLabel: 'CEX' },
    { value: 'htx', label: 'HTX', subLabel: 'CEX' },
    { value: 'gateio', label: 'Gate.io', subLabel: 'CEX' },
    { value: 'bitfinex', label: 'Bitfinex', subLabel: 'CEX' },
    { value: 'gemini', label: 'Gemini', subLabel: 'CEX' },
    { value: 'crypto_com', label: 'Crypto.com', subLabel: 'CEX' },
    { value: 'bitstamp', label: 'Bitstamp', subLabel: 'CEX' },
    { value: 'mexc', label: 'MEXC', subLabel: 'CEX' },
    { value: 'uniswap', label: 'Uniswap', subLabel: 'DEX' },
    { value: 'pancakeswap', label: 'PancakeSwap', subLabel: 'DEX' },
    { value: 'sushiswap', label: 'SushiSwap', subLabel: 'DEX' },
    { value: 'curve', label: 'Curve', subLabel: 'DEX' },
    { value: '1inch', label: '1inch', subLabel: 'DEX' },
    { value: 'balancer', label: 'Balancer', subLabel: 'DEX' },
    { value: 'traderjoe', label: 'Trader Joe', subLabel: 'DEX' },
    { value: 'raydium', label: 'Raydium', subLabel: 'DEX' },
    { value: 'jupyter', label: 'Jupyter', subLabel: 'DEX' },
    { value: 'orca', label: 'Orca', subLabel: 'DEX' },
    { value: 'aerodrome', label: 'Aerodrome', subLabel: 'DEX' }
];

const NETWORK_SUBLABELS = {
    'Ethereum': 'mainnet',
    'Arbitrum': 'arbitrum one',
    'Optimism': 'op mainnet',
    'Base': 'base mainnet',
    'Polygon': 'pos / matic',
    'BSC': 'bnb smart chain',
    'Solana': 'solana mainnet',
    'TRON': 'tron network',
    'Bitcoin': 'btc mainnet',
    'Lightning': 'lightning network',
    'Avalanche C-Chain': 'avax c-chain',
    'Dogecoin': 'doge mainnet',
    'Polkadot': 'dot mainnet',
    'Litecoin': 'ltc mainnet',
    'Bitcoin Cash': 'bch mainnet',
    'XRPL': 'xrp ledger',
    'Cardano': 'cardano mainnet',
};

const FeeCalculator = () => {
    const [activeTab, setActiveTab] = useState('transfer');
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        crypto: '',
        amount: '',
        network: '',
        platformFrom: '',
        platformTo: '',
        platformSwap: '',
        toCrypto: '',
    });
    const [result, setResult] = useState({ networkFee: 0, platformFee: 0, total: 0 });

    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const res = await axios.get(`${API_URL}/cryptos`);
                setCryptos(res.data);
            } catch (err) {
                console.error('Failed to fetch cryptos', err);
            }
        };
        fetchCryptos();
    }, []);

    useEffect(() => {
        const calculate = async () => {
            if (!formData.crypto || !formData.amount) {
                setResult({ networkFee: 0, platformFee: 0, total: 0 });
                return;
            }

            if (activeTab === 'transfer' && !formData.network) return;

            setLoading(true);
            try {
                const res = await axios.post(`${API_URL}/calculate`, {
                    ...formData,
                    platform: activeTab === 'transfer' ? formData.platformFrom : formData.platformSwap,
                    type: activeTab
                });
                setResult(res.data);
            } catch (err) {
                console.error('Calculation error', err);
            } finally {
                setLoading(false);
            }
        };

        const debounceId = setTimeout(calculate, 500);
        return () => clearTimeout(debounceId);
    }, [formData, activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData({ crypto: '', amount: '', network: '', platformFrom: '', platformTo: '', platformSwap: '', toCrypto: '' });
        setResult({ networkFee: 0, platformFee: 0, total: 0 });
    };

    const cryptoOptions = cryptos.map(c => ({
        value: c.id,
        label: c.symbol,
        subLabel: c.name
    }));

    const selectedCrypto = cryptos.find(c => c.id === formData.crypto);
    const selectedNetworkOptions = selectedCrypto?.networks.map(n => ({
        value: n,
        label: n,
        subLabel: NETWORK_SUBLABELS[n] || 'network'
    })) || [];

    // Native gas token mock
    const getNativeGasToken = (network) => {
        if (!network) return '';
        if (['Ethereum', 'Arbitrum', 'Optimism', 'Base'].includes(network)) return 'ETH';
        if (network === 'BSC') return 'BNB';
        if (network === 'Polygon') return 'MATIC';
        if (network === 'Solana') return 'SOL';
        if (network === 'TRON') return 'TRX';
        if (network === 'Bitcoin' || network === 'Lightning') return 'BTC';
        return 'Token';
    };

    // Gas token price mock (should be fetched dynamically ideally)
    const nativeGasToken = getNativeGasToken(formData.network);
    const gasTokenObj = cryptos.find(c => c.symbol === nativeGasToken);
    const gasUnitPrice = gasTokenObj?.price || 1;

    // Operation token price
    const operationUnitPrice = selectedCrypto?.price || 1;

    // Fees formatting logic
    const networkFeeNative = result.networkFee;
    const networkFeeUSD = networkFeeNative * gasUnitPrice;

    const platformFeeOperation = result.platformFee;
    const platformFeeUSD = platformFeeOperation * operationUnitPrice;

    const totalUSD = networkFeeUSD + platformFeeUSD;

    const formatCurrency = (val, isUSD) => {
        if (isUSD) return val.toFixed(2);
        return val < 0.01 && val > 0 ? val.toFixed(4) : val.toFixed(2);
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', width: '100%', boxSizing: 'border-box' }}>
            {/* Tabs */}
            <div className="flex-center" style={{ marginBottom: '2rem', gap: '1rem' }}>
                <button
                    className={`tab-btn`}
                    onClick={() => handleTabChange('transfer')}
                    style={{
                        background: activeTab === 'transfer' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        border: activeTab === 'transfer' ? '1px solid var(--accent-color)' : '1px solid transparent',
                        color: activeTab === 'transfer' ? 'var(--accent-color)' : 'var(--text-color)',
                        padding: '10px 20px',
                        borderRadius: '99px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <ArrowRightLeft size={18} /> Transfer
                </button>
                <button
                    className={`tab-btn`}
                    onClick={() => handleTabChange('swap')}
                    style={{
                        background: activeTab === 'swap' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                        border: activeTab === 'swap' ? '1px solid var(--accent-color)' : '1px solid transparent',
                        color: activeTab === 'swap' ? 'var(--accent-color)' : 'var(--text-color)',
                        padding: '10px 20px',
                        borderRadius: '99px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <RefreshCw size={18} /> Swap
                </button>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'transfer' ? (
                        <TransferForm
                            formData={formData}
                            setFormData={setFormData}
                            cryptoOptions={cryptoOptions}
                            networkOptions={selectedNetworkOptions}
                            selectedCrypto={selectedCrypto}
                        />
                    ) : (
                        <SwapForm
                            formData={formData}
                            setFormData={setFormData}
                            cryptoOptions={cryptoOptions}
                            selectedCrypto={selectedCrypto}
                        />
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Results Section */}
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Estimated Costs</h3>
                    {loading && <Loader2 className="animate-spin" size={20} color="var(--accent-color)" />}
                </div>

                <div className="grid-2" style={{ gap: '1rem' }}>

                    <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Network Fee</span>
                            <span style={{ fontWeight: '500' }}>{formatCurrency(networkFeeNative, false)} {nativeGasToken} <span style={{ opacity: 0.6, fontSize: '0.85em', fontWeight: 'normal' }}>(≈ {formatCurrency(networkFeeUSD, true)} USD)</span></span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Platform Fee</span>
                            <span style={{ fontWeight: '500' }}>{formatCurrency(platformFeeOperation, false)} {selectedCrypto?.symbol || ''} <span style={{ opacity: 0.6, fontSize: '0.85em', fontWeight: 'normal' }}>(≈ {formatCurrency(platformFeeUSD, true)} USD)</span></span>
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--accent-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.1rem', color: 'var(--accent-color)', fontWeight: '500' }}>Total Cost</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                            {formatCurrency(totalUSD, true)} USD
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransferForm = ({ formData, setFormData, cryptoOptions, networkOptions, selectedCrypto }) => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="grid-2" style={{ gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Cryptocurrency</label>
                <CustomSelect
                    options={cryptoOptions}
                    value={formData.crypto}
                    onChange={(val) => setFormData({ ...formData, crypto: val, network: '' })}
                    placeholder="Select Crypto"
                />
            </div>
            <div>
                <AmountInput
                    value={formData.amount}
                    onChange={(val) => setFormData({ ...formData, amount: val })}
                    tokenSymbol={selectedCrypto?.symbol || ''}
                    tokenPrice={selectedCrypto?.price || null}
                />
            </div>
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Network</label>
            <CustomSelect
                options={networkOptions}
                value={formData.network}
                onChange={(val) => setFormData({ ...formData, network: val })}
                placeholder="Select Network"
                disabled={!formData.crypto}
            />
        </div>

        <div className="grid-2" style={{ gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>From Platform</label>
                <CustomSelect
                    options={PLATFORMS}
                    value={formData.platformFrom}
                    onChange={(val) => setFormData({ ...formData, platformFrom: val })}
                    placeholder="Select Platform"
                />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Target Platform</label>
                <CustomSelect
                    options={PLATFORMS}
                    value={formData.platformTo}
                    onChange={(val) => setFormData({ ...formData, platformTo: val })}
                    placeholder="Select Platform"
                />
            </div>
        </div>
    </div>
);

const SwapForm = ({ formData, setFormData, cryptoOptions, selectedCrypto }) => (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="swap-grid">
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>From</label>
                <CustomSelect
                    options={cryptoOptions}
                    value={formData.crypto}
                    onChange={(val) => setFormData({ ...formData, crypto: val })}
                    placeholder="Select"
                />
            </div>
            <div className="swap-icon-container" style={{ paddingBottom: '12px', color: 'var(--accent-color)' }}>
                <ArrowRightLeft size={20} />
            </div>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>To</label>
                <CustomSelect
                    options={cryptoOptions}
                    value={formData.toCrypto}
                    onChange={(val) => setFormData({ ...formData, toCrypto: val })}
                    placeholder="Select"
                />
            </div>
        </div>

        <div>
            <AmountInput
                value={formData.amount}
                onChange={(val) => setFormData({ ...formData, amount: val })}
                tokenSymbol={selectedCrypto?.symbol || ''}
                tokenPrice={selectedCrypto?.price || null}
            />
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Platform</label>
            <CustomSelect
                options={PLATFORMS.filter(p => p.subLabel === 'DEX' || p.subLabel === 'CEX')}
                value={formData.platformSwap}
                onChange={(val) => setFormData({ ...formData, platformSwap: val })}
                placeholder="Select DEX/CEX"
            />
        </div>
    </div>
);

export default FeeCalculator;
