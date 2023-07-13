import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const weight = Number(req.query.weight);
    const height = Number(req.query.height);
    if (isNaN(weight) || isNaN(height)) {
        return res.status(400).json({ error: "malformatted parameters" });
    }
    return res.status(200).json({weight: weight, height: height, bmi: calculateBmi(height, weight)});
});

interface UserValues {
    target: number;
    daily_exercises: number[];
}

app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { target, daily_exercises }: UserValues = req.body;

    // validate the data here
    if (!target || !daily_exercises) {
        return res.status(400).json({ error: "parameters missing" });
    }

    const values = [target].concat(daily_exercises).map(Number);
    let isOk = true;
    values.forEach(value =>  {
        if (isNaN(value)) {
            isOk = false;
        }
    });
    if (!isOk) {
        return res.status(400).json({ error: "malformatted parameters" });
    }

    return res.status(200).json(calculateExercises(values));
});


const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});