import axios from 'axios';

let cryptoCache = {
    data: null,
    lastUpdate: 0
};

const topNetworks = {
    'bitcoin': ['Bitcoin', 'Lightning'],
    'ethereum': ['Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon'],
    'tether': ['TRON', 'Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Solana'],
    'binancecoin': ['BSC', 'opBNB'],
    'solana': ['Solana'],
    'ripple': ['XRPL'],
    'usd-coin': ['Ethereum', 'Solana', 'Base', 'Polygon', 'Arbitrum', 'Optimism'],
    'staked-ether': ['Ethereum'],
    'cardano': ['Cardano'],
    'avalanche-2': ['Avalanche C-Chain'],
    'dogecoin': ['Dogecoin'],
    'polkadot': ['Polkadot'],
    'tron': ['TRON'],
    'chainlink': ['Ethereum', 'BSC', 'Polygon'],
    'matic-network': ['Polygon', 'Ethereum'],
    'shiba-inu': ['Ethereum', 'Shibarium'],
    'litecoin': ['Litecoin'],
    'dai': ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
    'bitcoin-cash': ['Bitcoin Cash'],
    'uniswap': ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon']
};

const fallbackCryptos = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', networks: ['Bitcoin', 'Lightning'], price: 65000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', networks: ['Ethereum', 'Arbitrum', 'Optimism'], price: 3500 },
    { id: 'tether', name: 'Tether', symbol: 'USDT', networks: ['TRON', 'Ethereum', 'BSC'], price: 1 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', networks: ['Solana'], price: 150 },
];

export const getCryptos = async (req, res) => {
    const now = Date.now();
    if (cryptoCache.data && now - cryptoCache.lastUpdate < 60000) {
        return res.json(cryptoCache.data);
    }

    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: 20,
                page: 1,
                sparkline: false
            }
        });

        const cryptos = response.data.map(coin => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            price: coin.current_price,
            networks: topNetworks[coin.id] || ['Native']
        }));

        cryptoCache = {
            data: cryptos,
            lastUpdate: now
        };

        res.json(cryptos);
    } catch (error) {
        console.error('Error fetching cryptos:', error.message);
        if (cryptoCache.data) return res.json(cryptoCache.data);
        res.json(fallbackCryptos);
    }
};

export const calculateFee = (req, res) => {
    const { crypto, amount, network, type } = req.body;

    // Simulation Logic
    let networkFee = 0;
    let platformFee = 0;

    // Use lowercase exact matches from network strings above
    if (network === 'Bitcoin') networkFee = 0.0001;
    if (network === 'Lightning') networkFee = 0.000001;
    if (network === 'Ethereum') networkFee = 0.002;
    if (network === 'TRON') networkFee = 1;
    if (network === 'Solana') networkFee = 0.000005;
    if (network === 'BSC') networkFee = 0.001;
    if (network === 'Arbitrum') networkFee = 0.0001;
    if (network === 'Optimism') networkFee = 0.0001;
    if (network === 'Polygon') networkFee = 0.01;
    if (network === 'Base') networkFee = 0.00005;

    // Adjust for token transfers vs native
    if (crypto === 'tether' && network === 'Ethereum') networkFee = 5;

    // Platform Fee (e.g. 0.1% for swap, 0.05% for transfer)
    if (type === 'swap') {
        platformFee = amount * 0.001;
    } else {
        platformFee = amount * 0.0005;
    }

    res.json({
        networkFee, // Native token amount (mocked)
        platformFee, // Platform fee amount (in operation token usually)
        total: networkFee + platformFee // In this mock, we just sum it, but frontend will display it correctly
    });
};
