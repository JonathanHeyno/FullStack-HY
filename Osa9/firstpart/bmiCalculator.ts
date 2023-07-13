export interface CheckValues {
  height: number;
  weight: number;
}
  
const parseArguments = (args: string[]): CheckValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};
  
const calculateBmi = (height: number, weight: number) => {
  const BMI = 10000 * weight / (height*height);
  if (BMI < 16) { return 'Underweight (Severe thinness)';} else
  if (BMI < 16.9) { return 'Underweight (Moderate thinness)';} else
  if (BMI < 18.4) { return 'Underweight (Mild thinness)';} else
  if (BMI < 24.9) { return 'Normal range';} else
  if (BMI < 29.9) { return 'Overweight (Pre-obese)';} else
  if (BMI < 34.9) { return 'Obese (Class I)';} else
  if (BMI < 39.9) { return 'Obese (Class II)';}
  else { return 'Obese (Class III)';}
};

if (process.argv.length === 4) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateBmi;