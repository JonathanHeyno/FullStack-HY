import { useState, SyntheticEvent } from "react";
import {  TextField, InputLabel, MenuItem, Select, Grid, Button, SelectChangeEvent, ListItemText, Checkbox, OutlinedInput, Input } from '@mui/material';
import { EntryWithoutId, HealthCheckRating, SickLeave, Discharge, Diagnosis } from "../../types";

interface Props {
  diagnoses: Diagnosis[];
  onSubmit: (values: EntryWithoutId) => void;
}

interface HealthCheckOption{
  value: string;
  label: string;
}

const healthCheckOptions: HealthCheckOption[] = Object.keys(HealthCheckRating).map(v => ({
    value: v, label: v
  }));

const AddEntryForm = ({ onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');

  const clear = () => {
    setType('');
    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
    setHealthCheckRating('');
    setEmployerName('');
    setSickLeaveStartDate('');
    setSickLeaveEndDate('');
    setDischargeDate('');
    setDischargeCriteria('');
  };

  const cancel = (event: SyntheticEvent) => {
    event.preventDefault();
    clear();
  };

  const onHealthCheckChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const healthCheck = Object.values(HealthCheckRating).find(hc => hc.toString() === value);
      if (healthCheck) {
        setHealthCheckRating(value);
      }
    }
  };

  const onDiagnosisAddition = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const sickLeave: SickLeave = {
        startDate: sickLeaveStartDate,
        endDate: sickLeaveEndDate
    }
    const discharge: Discharge = {
        date: dischargeDate,
        criteria: dischargeCriteria
    }
    const healthCheckRatingCorrected = Object.keys(HealthCheckRating).indexOf(healthCheckRating) - healthCheckOptions.length/2;
    const base = {
        description: description,
        date: date,
        specialist: specialist,
    }
    const dcodes = diagnosisCodes? {diagnosisCodes: diagnosisCodes } : {}
    const sickL = (sickLeaveStartDate && sickLeaveEndDate)? {sickLeave: sickLeave } : {}

    switch (type) {
      case "HealthCheck":
        onSubmit({
          type: "HealthCheck",
          healthCheckRating: healthCheckRatingCorrected,
          ...base,
          ...dcodes
        });
        clear();
        break;
      case "OccupationalHealthcare":
        onSubmit({
          type: "OccupationalHealthcare",
          employerName: employerName,
          ...base,
          ...dcodes,
          ...sickL
        });
        clear();
        break;
      case "Hospital":
        onSubmit({
          type: "Hospital",
          discharge: discharge,
          diagnosisCodes: diagnosisCodes,
          ...base,
        });
        clear();
        break;
      default:
        console.log('Entry type does not exist')
    }
  };

  const AddBase = (): JSX.Element => {
    return (
      <div>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <InputLabel>Date</InputLabel>
        <Input type="date" value={date} onChange={({ target }) => setDate(target.value)} />
        <TextField
          label="Specialist"
          fullWidth
          style={{marginTop: 5}}
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <InputLabel style={{ marginTop: 20 }}>Diagnosis codes</InputLabel>
          <Select
            label="Diagnosis codes"
            multiple
            fullWidth
            value={diagnosisCodes}
            onChange={onDiagnosisAddition}
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox checked={diagnosisCodes.indexOf(diagnosis.code) > -1} />
                <ListItemText primary={`${diagnosis.code} ${diagnosis.name}`} />
              </MenuItem>
            ))}
          </Select>
      </div>
    )
  };

  const AddHospitalEntry = (): JSX.Element => {
    if (type === "Hospital")
      return (
        <div>
          {AddBase()}
          <InputLabel>Discharge date</InputLabel>
          <Input type="date" value={dischargeDate} onChange={({ target }) => setDischargeDate(target.value)} />
          <TextField
            label="Discharge criteria"
            fullWidth
            style={{marginTop: 5}}
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        </div>
      )
    else {
      return (<div></div>);
    }
  };

  const AddHealthEntry = (): JSX.Element => {
    if (type === "HealthCheck")
      return (
        <div>
          {AddBase()}
          <InputLabel style={{ marginTop: 20 }}>Health check rating</InputLabel>
          <Select
            label="Health check rating"
            fullWidth
            value={healthCheckRating}
            onChange={onHealthCheckChange}
          >
          {healthCheckOptions.slice(healthCheckOptions.length/2, healthCheckOptions.length).map(option =>
            <MenuItem key={option.label} value={option.value} >
              {option.label}
            </MenuItem>
          )}
          </Select>
        </div>
      )
    else {
      return (<div></div>);
    }
  };
  
  const AddOccupationalEntry = (): JSX.Element => {
    if (type === "OccupationalHealthcare")
      return (
        <div>
          {AddBase()}
          <TextField
            label="Employer name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
          <InputLabel>Sick leave start date</InputLabel>
          <Input type="date" value={sickLeaveStartDate} onChange={({ target }) => setSickLeaveStartDate(target.value)} />
          <InputLabel>Sick leave start date</InputLabel>
          <Input type="date" value={sickLeaveEndDate} onChange={({ target }) => setSickLeaveEndDate(target.value)} />
        </div>
      )
    else {
      return (<div></div>);
    }
  };

  return (
    <div style={{ marginBottom: 60, borderStyle: "dotted", paddingBottom: 50, paddingLeft: 5, paddingRight: 5 }}>
      <form onSubmit={addEntry}>
      <InputLabel style={{ marginTop: 20 }}>Entry type</InputLabel>
        <Select
          label="Type of entry"
          fullWidth
          value={type}
          onChange={({ target }) => setType(target.value)}
        >
        {["HealthCheck", "OccupationalHealthcare", "Hospital"].map(option =>
          <MenuItem key={option} value={option} >
            {option}
          </MenuItem>
        )}
        </Select>
        {AddHealthEntry()}
        {AddHospitalEntry()}
        {AddOccupationalEntry()}

        <Grid style={{ marginTop: 10 }}>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={cancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add Entry
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};


export default AddEntryForm;
