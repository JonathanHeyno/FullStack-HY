import patientData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import { NonSensitivePatient, NewPatient, Patient, EntryWithoutId, Entry } from '../types';

const patients: Patient[] = patientData

const getPatients = (): Patient[] => {
    return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientData.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries,
  }));
};

const findById = (id: string): Patient | undefined => {  const patient = patients.find(p => p.id === id);
  return patient;
}

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (entry: EntryWithoutId, patient: Patient ): Entry => {
  const newEntry: Entry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return newEntry;
};


export default {
  getPatients,
  addPatient,
  getNonSensitivePatients,
  findById,
  addEntry
};