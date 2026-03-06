import express from 'express';
import { getCryptos, calculateFee } from '../controllers/feeController.js';

const router = express.Router();

router.get('/cryptos', getCryptos);
router.post('/calculate', calculateFee);

export default router;
