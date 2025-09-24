import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import { Diagnosis, Patient } from "../../types";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { Entry } from "../../types";

const EntryComponent = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => (
  <div key={entry.id}>
    {entry.date} {entry.description}<br></br>

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
);

const PatientInfoPage = () => {
  const id = useParams<{ id: string }>().id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

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
      
      <h3>Entries</h3>

      {patient.entries.map(entry => (
        <EntryComponent entry={entry} key={entry.id} diagnoses={diagnoses}/>
      ))}
    </div>
  );
};

export default PatientInfoPage;