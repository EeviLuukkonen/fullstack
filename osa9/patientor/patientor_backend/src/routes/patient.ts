import express from 'express';
import patientService from '../services/patientService';
import { NewPatientEntrySchema } from '../utils';
import z from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log("fetching patients");
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send(patientService.getPatient(id));
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = NewPatientEntrySchema.parse(req.body);

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