import express from 'express';
import patientService from '../services/patientService';
import { EntryWithoutId } from '../types';
import toNewPatient from '../utils';
import { toNewEntry } from '../utils';


const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(String(req.params.id));

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  try {
    const newpatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newpatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});


router.post('/:id/entries', (req, res) => {
  const patient = patientService.findById(String(req.params.id));
  if (patient) {
    try {
      const newEntry: EntryWithoutId = toNewEntry(req.body);
      const addedEntry = patientService.addEntry(newEntry, patient);
      res.json(addedEntry);
    } catch (error: unknown) {
      let errorMessage = 'Something went wrong.';
      if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
      }
      res.status(400).send(errorMessage);
    }
    res.status(200).send();
  }
  else {
    res.status(404).send('patient not found');
  }
});

export default router;