import { z } from 'zod';
import { NewPatientSchema, NewEntrySchema, HealthCheckEntrySchema, HospitalEntrySchema, OccupationalHealthcareEntrySchema,  } from './utils';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient extends NewPatient {
  id: string;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export type SickLeave = {
  startDate: string,
  endDate: string,
}

export type Discharge = {
  date: string;
  criteria: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export type NewEntry = z.infer<typeof NewEntrySchema>;

export type Entry = NewEntry & { id: string };

export type HealthCheckEntry = z.infer<typeof HealthCheckEntrySchema> & { id: string };
export type HospitalEntry = z.infer<typeof HospitalEntrySchema> & { id: string };
export type OccupationalHealthcareEntry = z.infer<typeof OccupationalHealthcareEntrySchema> & { id: string };