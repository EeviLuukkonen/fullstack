import express from 'express';
const app = express();
import { calculateBmi } from './bmiCalculator';
import { calculateExercises, isNumber, dailyExcerciseHours } from './exerciseCalculator';

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello fullstack');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.send({
      error: "missing parameters"
    });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (isNaN(heightNum) || isNaN(weightNum)) {
    res.send({
      error: "malformatted parameters"
    });
  }

  const bmi = calculateBmi(heightNum, weightNum);

  res.send({
    height,
    weight,
    bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.send({
      error: "parameters missing"
    });
  }

  if (!Array.isArray(daily_exercises) || !isNumber(target) || !daily_exercises.every(i => isNumber(i))) {
    res.send({
      error: "malformatted parameters"
    });
  }

  const result = calculateExercises(daily_exercises as dailyExcerciseHours, target as number);
  return res.send({result});
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});