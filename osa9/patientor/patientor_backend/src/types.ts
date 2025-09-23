import { z } from 'zod';
import { NewPatientEntrySchema } from './utils';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient extends NewPatientEntry {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;

export type NewPatientEntry = z.infer<typeof NewPatientEntrySchema>;