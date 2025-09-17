import { Gender, NewPatientEntry } from "./types";

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  if ( !object || typeof object !== 'object' ) {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'occupation' in object && 'gender' in object && 'dateOfBirth' in object && 'ssn' in object) {
    const newEntry: NewPatientEntry = {
      name: parseField(object.name),
      occupation: parseField(object.occupation),
      gender: parseGender(object.gender),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseField(object.ssn)
    };
    return newEntry;
  };
  throw new Error('Incorrect data: some fields are missing!');
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).map(v => v.toString()).includes(param);
};

const parseField = (field: unknown): string => {
  if (!isString(field)) {
    throw new Error('Invalid name');
  }

  return field;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect date: ' + date);
  }
  return date;
};

const parseGender = (gender: unknown): string => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect gender');
  }
  return gender;
};
