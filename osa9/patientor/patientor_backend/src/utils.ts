import z from "zod";
import { Gender, NewPatientEntry } from "./types";

export const EntrySchema = z.looseObject({
  type: z.enum(["HealthCheck", "Hospital", "OccupationalHealthcare"]),
});

export const NewPatientEntrySchema = z.object({
  name: z.string(),
  occupation: z.string(),
  gender: z.enum(Gender),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  entries: z.array(EntrySchema).default([])
});

export const toNewEntry = (object: unknown): NewPatientEntry => {
  return NewPatientEntrySchema.parse(object);
};