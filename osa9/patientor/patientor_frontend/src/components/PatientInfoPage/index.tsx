import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { Patient } from "../../types";
import { useParams } from "react-router-dom";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

const PatientInfoPage = () => {
  const id = useParams<{ id: string }>().id;
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (id) {
        const patient = await patientService.getById(id);
        setPatient(patient);

      }
    };

    fetchPatientData();

  });

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
    </div>
  );
};

export default PatientInfoPage;