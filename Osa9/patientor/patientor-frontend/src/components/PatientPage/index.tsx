import { useState, useEffect } from "react";
import {useParams} from 'react-router-dom';
import axios from 'axios';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Alert } from '@mui/material';

import { Patient, Entry, Diagnosis, Discharge, SickLeave, HealthCheckRating, EntryWithoutId } from "../../types";
import patientService from "../../services/patients";
import AddEntryForm from "./AddEntryForm";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const HospitalEntry = ({ entry, diagnoses, discharge }: { entry: Entry, diagnoses: Diagnosis[], discharge: Discharge }): JSX.Element => {
  return (
    <div style={{borderRadius: "5px", border: "2px solid black", padding: "5px", margin: "5px"}} >
      <p>{entry.date}<LocalHospitalIcon /></p>
      <p><i>{entry.description}</i></p>
      <ul>
      {entry.diagnosisCodes?.map((code: string) =>
        <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
      )}
      </ul>
      <p>Discharge: {discharge.date}  {discharge.criteria}</p>
      <p>diagnose by {entry.specialist}</p>
    </div>
  )
};

const OccupationalHealthcare = ({ entry, diagnoses, employerName, sickLeave }: { entry: Entry, employerName:string, sickLeave?:SickLeave, diagnoses: Diagnosis[] }): JSX.Element => {
  return (
    <div style={{borderRadius: "5px", border: "2px solid black", padding: "5px", margin: "5px"}}>
      <p>{entry.date} <WorkIcon /> {employerName}</p>
      <p><i>{entry.description}</i></p>
      <ul>
      {entry.diagnosisCodes?.map((code: string) =>
        <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
      )}
      </ul>
      {sickLeave? <p>Sickleave: {sickLeave.startDate} - {sickLeave.endDate}</p> : <p></p>}
      <p>diagnose by {entry.specialist}</p>
    </div>
  )
};

const Rating = ({ healthCheckRating }: {healthCheckRating: HealthCheckRating }): JSX.Element => {
switch(healthCheckRating) {
  case 0:
    return <FavoriteIcon color={'success'}/>;
  case 1:
    return <FavoriteIcon color={'action'}/>;
  case 2:
    return <FavoriteIcon color={'warning'}/>;
  case 3:
    return <FavoriteIcon color={'error'}/>;
  default:
    return (<div></div>);
}
}

const HealthCheck = ({ entry, diagnoses, healthCheckRating }: { entry: Entry, diagnoses: Diagnosis[], healthCheckRating: HealthCheckRating }): JSX.Element => {
  return (
    <div style={{borderRadius: "5px", border: "2px solid black", padding: "5px", margin: "5px"}} >
      <p>{entry.date} <MedicalServicesIcon /> </p>
      <p><i>{entry.description}</i></p>
      <ul>
      {entry.diagnosisCodes?.map((code: string) =>
        <li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>
      )}
      </ul>
      <p>health check rating: </p> <Rating healthCheckRating={healthCheckRating} />
      <p>diagnose by {entry.specialist}</p>
    </div>
  )
};

const EntryDetails: React.FC<{ entry: Entry, diagnoses: Diagnosis[] }> = ({entry, diagnoses}) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry entry={entry} diagnoses={diagnoses} discharge={entry.discharge} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} diagnoses={diagnoses} employerName={entry.employerName} sickLeave={entry.sickLeave} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} diagnoses={diagnoses} healthCheckRating={entry.healthCheckRating}/>;
    default:
      return assertNever(entry);
  }
}

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {

  const [patient, setPatient] = useState<Patient>();
  const id:string = useParams().id || '';
  const [error, setError] = useState<string>();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const fetchPatient = async () => {
      const retrievedPatient = await patientService.getPatient(id);
      setPatient(retrievedPatient);
      setEntries(retrievedPatient.entries);
    };
    try {
      void fetchPatient();
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
        } else {
          console.log("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
      }
    }
  }, [id]);

  if (!patient) {
    return (<div>loading...</div>);
  }

  const submitNewEntry = async (values: EntryWithoutId) => {
    try {
      const entry = await patientService.createEntry(values, patient.id);
      patient.entries = patient.entries.concat(entry);
      setEntries(entries.concat(entry));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
          setTimeout(function() {setError(undefined)}, 4000);
        } else {
          setError("Unrecognized axios error");
          setTimeout(function() {setError(undefined)}, 4000);
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
        setTimeout(function() {setError(undefined)}, 4000);
      }
    }
  };



  return (
    <div className="App">
      {error && <Alert severity="error">{error}</Alert>}
      <h1>{patient.name}</h1>
      <p>gender: {patient.gender}</p>
      <p>date of birth: {patient.dateOfBirth}</p>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <h3>entries</h3>
      <AddEntryForm onSubmit={submitNewEntry} diagnoses={diagnoses} />
      {entries.map((entry: Entry) =>
        <div key={entry.id}><EntryDetails entry={entry} diagnoses={diagnoses}/></div>
      )}
    </div>
  );
};

export default PatientPage;
