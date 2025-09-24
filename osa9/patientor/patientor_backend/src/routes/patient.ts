import express from 'express';
import patientService from '../services/patientService';
import { NewPatientSchema, NewEntrySchema } from '../utils';
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
    const newPatient = NewPatientSchema.parse(req.body);

    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    };
  };
});

router.post('/:id/entries', (req, res) => {
  console.log(`adding entry for patient ${req.params.id}`)
  try {
    const newEntry = NewEntrySchema.parse(req.body);
    
    const addedEntry = patientService.addEntry(req.params.id, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  };
})

export default router;