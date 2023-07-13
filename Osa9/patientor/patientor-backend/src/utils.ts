import { NewPatient, Gender, Diagnosis, EntryWithoutId, Discharge, SickLeave, HealthCheckRating } from './types';

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (text: unknown): text is Number => {
    return typeof text === 'number' || text instanceof Number;
};
  
const parseParameter = (parameter: unknown): string => {
    if (!isString(parameter)) {
        throw new Error('Incorrect or missing parameter');
    }

    return parameter;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
}
return date;
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender).map(v => v.toString()).includes(param);
};
  
const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect gender: ' + gender);
    }
    return gender;
};


const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> =>  {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
      // we will just trust the data to be in correct form
      return [] as Array<Diagnosis['code']>;
    }
  
    return object.diagnosisCodes as Array<Diagnosis['code']>;
  };
 
const parseDischarge = (discharge: unknown): Discharge => {
    if (!discharge || typeof discharge !== 'object' || !('date' in discharge) || !('criteria' in discharge)) {
        throw new Error('Incorrect discharge: ' + discharge);
    }

    const newDischarge: Discharge = {
        date: parseDate(discharge.date),
        criteria: parseParameter(discharge.criteria),
    }
    return newDischarge;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
    if (!sickLeave || typeof sickLeave !== 'object' || !('startDate' in sickLeave) || !('endDate' in sickLeave)) {
        throw new Error('Incorrect sick leave: ' + sickLeave);
    }

    const newSickLeave: SickLeave = {
        startDate: parseDate(sickLeave.startDate),
        endDate: parseParameter(sickLeave.endDate),
    }
    return newSickLeave;
};

const isHealthCheckRating = (param: Number): param is HealthCheckRating => {
   if ( param === 0 || param === 1 || param === 2 || param === 3 ) {
    return true;
    }
    return false;
};
  
const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
    if (!isNumber(rating) || !isHealthCheckRating(rating)) {
        throw new Error('Incorrect health check rating');
    }
    return rating;
};

const toNewPatient = (object: unknown): NewPatient => {
    if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
    }

    if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object)  {
        const newPatient: NewPatient = {
          name: parseParameter(object.name),
          dateOfBirth: parseDate(object.dateOfBirth),
          ssn: parseParameter(object.ssn),
          gender: parseGender(object.gender),
          occupation: parseParameter(object.occupation),
          entries: []
        };

        return newPatient;
      }

  throw new Error('Incorrect data: a field missing');
};

const newHospital = (object: unknown): EntryWithoutId => {
    if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
    }

    if ('description' in object && 'date' in object && 'specialist' in object && 'diagnosisCodes' in object && 'discharge' in object)  {
    const newEntry: EntryWithoutId = {
        description: parseParameter(object.description),
        date: parseDate(object.date),
        specialist: parseParameter(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object),
        type: 'Hospital',
        discharge: parseDischarge(object.discharge),
    };

    return newEntry;
    }
    throw new Error('Incorrect data: a field missing');
}

const newOccupational = (object: unknown): EntryWithoutId => {
    if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
    }

    if ('description' in object && 'date' in object && 'specialist' in object && 'employerName' in object)  {
        const newEntry: EntryWithoutId = {
            description: parseParameter(object.description),
            date: parseDate(object.date),
            specialist: parseParameter(object.specialist),
            type: 'OccupationalHealthcare',
            employerName: parseParameter(object.employerName),
        };
        if ('sickLeave' in object) {
            newEntry.sickLeave = parseSickLeave(object.sickLeave);
        }
        if ('diagnosisCodes' in object) {
            newEntry.diagnosisCodes = parseDiagnosisCodes(object);
        }

    return newEntry;
    }
    throw new Error('Incorrect data: a field missing');
}

const newHealthCheck = (object: unknown): EntryWithoutId => {
    if ( !object || typeof object !== 'object' ) {
        throw new Error('Incorrect or missing data');
    }

    if ('description' in object && 'date' in object && 'specialist' in object && 'healthCheckRating' in object)  {
    const newEntry: EntryWithoutId = {
        description: parseParameter(object.description),
        date: parseDate(object.date),
        specialist: parseParameter(object.specialist),
        type: 'HealthCheck',
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
    };
    if ('diagnosisCodes' in object) {
        newEntry.diagnosisCodes = parseDiagnosisCodes(object);
    }

    return newEntry;
    }
    throw new Error('Incorrect data: a field missing');
}

export const toNewEntry = (object: unknown): EntryWithoutId => {
    if ( !object || typeof object !== 'object' || !('type' in object) ) {
        throw new Error('Incorrect or missing data');
    }

    if (object.type === 'Hospital' && 'discharge' in object ) {
        return newHospital(object=object);
    }
    else if (object.type === 'OccupationalHealthcare' && 'employerName' in object ) {
        return newOccupational(object=object);
    }
    else if (object.type === 'HealthCheck' && 'healthCheckRating' in object ) {
        return newHealthCheck(object=object);
    }
    else {
        throw new Error('Incorrect data: a field missing');
    }
};

export default toNewPatient;