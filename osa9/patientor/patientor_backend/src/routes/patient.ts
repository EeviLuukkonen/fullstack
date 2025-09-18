import express from 'express';
import patientService from '../services/patientService';
import { NewEntrySchema } from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
    console.log("fetching patients");
    res.send(patientService.getNonSensitivePatients());
  });

router.post('/', (req, res) => {
  try {
    const newPatientEntry = NewEntrySchema.parse(req.body);

    const addedPatient = patientService.addPatient(newPatientEntry);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    };
  };
});

export default router;