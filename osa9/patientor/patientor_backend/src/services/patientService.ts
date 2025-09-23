import patientData from '../../../data/patients';
import { NonSensitivePatient, Patient, NewPatientEntry } from '../types';
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

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient
};