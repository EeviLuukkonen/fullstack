import { useState } from "react";
import { NewEntry, Patient } from "../../types";
import { Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material';
import patientService from "../../services/patients";
import axios from "axios";

export interface EntryFormValues {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<string>;
  healthCheckRating: number;
}

interface Props {
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AddEntryForm = ({ patientId, setPatient, setError }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    const formValues: EntryFormValues = {
      description,
      date,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      diagnosisCodes: diagnosisCodes ? diagnosisCodes.split(',').map(code => code.trim()) : undefined
    };

    const entryToAdd: NewEntry = {
      ...formValues,
      type: "HealthCheck"
    };

    try {
      console.log('Submitting entry:', entryToAdd);
      const updatedPatient = await patientService.addEntry(patientId, entryToAdd);
      setPatient(updatedPatient);
      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating('');
      setDiagnosisCodes('');
      setError(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data.error[0].message) {
          let message = e?.response?.data.error[0].message;
          if (e.response.data.error[0].errors[0][0].message) {
            message += `: ${e.response.data.error[0].errors[0][0].message}`;
          }
          setError(message);
        } else {
          console.log(e?.response);
          console.log("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
      }
    }
  };
  
  return (
    <div>
      <Card style={{ marginTop: 20, marginBottom: 20 }}>
        <CardHeader title="Add new Healthcheck entry" />
        <CardContent>
          <form onSubmit={addEntry}>
            <Grid container direction="column" spacing={2}>
            <TextField
              label="Description"
              value={description}
              onChange={({ target }) => setDescription(target.value)}
            />
            <TextField
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChange={({ target }) => setDate(target.value)}
            />
            <TextField
              label="Specialist"
              value={specialist}
              onChange={({ target }) => setSpecialist(target.value)}
            />
            <TextField
              label="Healthcheck rating"
              value={healthCheckRating}
              onChange={({ target }) => setHealthCheckRating(target.value)}
            />
            <TextField
              label="Diagnosis codes"
              value={diagnosisCodes}
              onChange={({ target }) => setDiagnosisCodes(target.value)}
            />
            </Grid>
            <br />
            <br />
            <br />

            <Grid>
              <Grid item>
                <Button
                  style={{
                    float: "right", marginBottom: 10
                  }}
                  type="submit"
                  variant="contained"
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>


        </CardContent>
      </Card>
    </div>
  );
};

export default AddEntryForm;