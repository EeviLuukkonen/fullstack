import { useState } from "react";
import { Diagnosis, NewEntry, Patient } from "../../types";
import { Button, Card, CardContent, CardHeader, Grid, MenuItem, TextField, Select, OutlinedInput, SelectChangeEvent, InputLabel } from '@mui/material';
import patientService from "../../services/patients";
import axios from "axios";

export interface EntryFormValues {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<string>;
  healthCheckRating?: number;
  discharge?: { date: string; criteria: string };
  employerName?: string;
  sickLeave?: { startDate: string; endDate: string };
}

interface Props {
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  diagnoses: Array<Diagnosis>;
}

const AddEntryForm = ({ patientId, setPatient, setError, diagnoses }: Props) => {
  const [entryType, setEntryType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStart, setSickLeaveStart] = useState('');
  const [sickLeaveEnd, setSickLeaveEnd] = useState('');

  const handleDiagnosisMenuChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    console.log('Selected diagnosis codes:', event.target.value);
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const addEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    
    const baseValues: EntryFormValues = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes ? diagnosisCodes : undefined,
    };

    let entryToAdd: NewEntry;

    switch (entryType) {
      case "HealthCheck":
        entryToAdd = {
          ...baseValues,
          type: "HealthCheck",
          healthCheckRating: Number(healthCheckRating),
        };
        break;
      case "Hospital":
        entryToAdd = {
          ...baseValues,
          type: "Hospital",
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      case "OccupationalHealthcare":
        entryToAdd = {
          ...baseValues,
          type: "OccupationalHealthcare",
          employerName,
          sickLeave: sickLeaveStart && sickLeaveEnd ? { startDate: sickLeaveStart, endDate: sickLeaveEnd } : undefined,
        };
        break;
      default:
        return;
    }

    try {
      console.log('Submitting entry:', entryToAdd);
      const updatedPatient = await patientService.addEntry(patientId, entryToAdd);
      setPatient(updatedPatient);
      setDescription('');
      setDate('');
      setSpecialist('');
      setHealthCheckRating('');
      setDiagnosisCodes([]);
      setDischargeDate('');
      setDischargeCriteria('');
      setEmployerName('');
      setSickLeaveStart('');
      setSickLeaveEnd('');
      setError(null);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data.error[0].message) {
          let message = e?.response?.data.error[0].message;
          if (e?.response?.data.error[0].errors) {
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
                select
                label="Entry Type"
                value={entryType}
                onChange={({ target }) => setEntryType(target.value as "HealthCheck" | "Hospital" | "OccupationalHealthcare")}
              >
                <MenuItem value="HealthCheck">HealthCheck</MenuItem>
                <MenuItem value="Hospital">Hospital</MenuItem>
                <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
              </TextField>
              <TextField
                label="Description"
                value={description}
                onChange={({ target }) => setDescription(target.value)}
              />
              <TextField
                type="date"
                label="Date"
                value={date}
                onChange={({ target }) => setDate(target.value)}
              />
              <TextField
                label="Specialist"
                value={specialist}
                onChange={({ target }) => setSpecialist(target.value)}
              />

              <Select
                label="Diagnoses"
                id="diagnosis"
                multiple
                value={diagnosisCodes}
                onChange={handleDiagnosisMenuChange}
                input={<OutlinedInput label="Diagnosis" />}
              >
                {diagnoses.map((diagnosis) => (
                  <MenuItem
                    key={diagnosis["code"]}
                    value={diagnosis["code"]}
                  >
                    {`${diagnosis["code"]}`}
                  </MenuItem>
                ))}
              </Select>

              {entryType === "HealthCheck" && (
                <TextField
                  select
                  label="Healthcheck rating"
                  value={healthCheckRating}
                  onChange={({ target }) => setHealthCheckRating(target.value)}
                  >
                  <MenuItem value="0">Healthy</MenuItem>
                  <MenuItem value="1">Low Risk</MenuItem>
                  <MenuItem value="2">High Risk</MenuItem>
                  <MenuItem value="3">Critical Risk</MenuItem>
                </TextField>
              )}

              {entryType === "Hospital" && (
                <>
                  <TextField
                    label="Discharge date"
                    value={dischargeDate}
                    onChange={({ target }) => setDischargeDate(target.value)}
                  />
                  <TextField
                    label="Discharge criteria"
                    value={dischargeCriteria}
                    onChange={({ target }) => setDischargeCriteria(target.value)}
                  />
                </>
              )}

              {entryType === "OccupationalHealthcare" && (
                <>
                  <TextField
                    label="Employer name"
                    value={employerName}
                    onChange={({ target }) => setEmployerName(target.value)}
                  />
                  <TextField
                    label="Sick leave start date"
                    type="date"
                    value={sickLeaveStart}
                    onChange={({ target }) => setSickLeaveStart(target.value)}
                  />
                  <TextField
                    label="Sick leave end date"
                    type="date"
                    value={sickLeaveEnd}
                    onChange={({ target }) => setSickLeaveEnd(target.value)}
                  />
                </>
              )}
              
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