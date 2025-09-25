import patientData from '../../../data/patients';
import { NonSensitivePatient, Patient, NewPatient, NewEntry } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getPatients = () => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const getPatient = (id: string) => {
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    throw new Error(`Patient with id ${id} not found`);
  }
  return patient;
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry) => {
  const patient = getPatient(id);

  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  
  return patient;
}

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient,
  addEntry
};