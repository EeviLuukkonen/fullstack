import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import { Diagnosis, Patient } from "../../types";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { LocalHospital } from "@mui/icons-material";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import WorkIcon from '@mui/icons-material/Work';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import { Entry, HospitalEntry, OccupationalHealthcareEntry, HealthCheckEntry } from "../../types";
import { Card, CardContent, CardHeader } from '@mui/material';
import AddEntryForm from "./AddEntryForm";

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <Card>
      <CardHeader
        title={`${entry.date} - Hospital`}
        avatar={<LocalHospital />}
      />
      <CardContent>
        Description: <i>{entry.description}</i><br/>
        <p>
          Discharch: {entry.discharge.date}<br/>
          Reason for discharche: {entry.discharge.criteria}
        </p>
        Diagnosed by: {entry.specialist}
      </CardContent>
    </Card>
  );
};

const OccupationalHealthcareDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  return (
    <Card>
      <CardHeader
        title={`${entry.date} - Occupational`}
        avatar={<WorkIcon />}
      />
      <CardContent>
        Description: <i>{entry.description}</i><br/>
        Employer: {entry.employerName}<br/>
        {entry.sickLeave && (
          <>
            Sick leave: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}<br/>
          </>
        )}
        Diagnosed by: {entry.specialist}
      </CardContent>
    </Card>
  );
};

const HealthCheckDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <Card>
      <CardHeader
        title={`${entry.date} - Health check`}
        avatar={<MedicalInformationIcon />}
      />
      <CardContent>
        Description: <i>{entry.description}</i><br/>
        Health rate: <HealthRateIcon rate={entry.healthCheckRating}></HealthRateIcon>
        <br/>Diagnosed by: {entry.specialist}
      </CardContent>
    </Card>
  );
};

const HealthRateIcon = ({ rate }: { rate: 0 | 1 | 2 | 3 }) => {
  const colorMap: Record<number, "info" | "error" | "warning" | "success" > = {
    0: "success",
    1: "warning",
    2: "error",
    3: "info",
  };

  return <FavoriteTwoToneIcon color={colorMap[rate]} />;
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalEntryDetails entry={entry}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareDetails entry={entry}/>;
    case "HealthCheck":
      return <HealthCheckDetails entry={entry}/>;
    default:
      return assertNever(entry);
  }
};

const PatientInfoPage = () => {
  const id = useParams<{ id: string }>().id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);

      }
    };

    fetchPatientData();
  }, [id]);

  useEffect(() => {
    const fetchDiagnosisData = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };
  
    fetchDiagnosisData();
  }, []);

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{patient.name} 
        {patient.gender === 'female' && <FemaleIcon />}
        {patient.gender === 'male' && <MaleIcon />}
      </h2>
      ssn: {patient.ssn}<br/>
      occupation: {patient.occupation}

      <p></p>{error && <div style={{ color: 'red' }}>{`Error: ${error}`}</div>}
      <AddEntryForm patientId={patient.id} setPatient={setPatient} setError={setError} />
      
      <h3>Entries</h3>

      {patient.entries.map(entry => (
        <div key={entry.id}>
          <EntryDetails entry={entry}/>
          {entry.diagnosisCodes &&
            <ul>
              {entry.diagnosisCodes.map(code => {
                const diagnosis = diagnoses.find(d => d.code === code);
                return (
                  <li key={code}>
                    {code} {diagnosis && diagnosis.name}
                  </li>
                );
              })}
            </ul>
          }
        </div>
        )
      )}
    </div>
  );
};

export default PatientInfoPage;

function assertNever(entry: never): never {
  throw new Error(`Unhadled: ${JSON.stringify(entry)}`);
}
