import express from 'express';
import diagnosisService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
    console.log("fetching diagnoses");
    res.send(diagnosisService.getDiagnoses());
  });

export default router;