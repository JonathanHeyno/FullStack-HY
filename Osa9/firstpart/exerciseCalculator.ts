interface ResultValues {
    periodLength: number;
    trainingDays: number;
    target: number;
    average: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
}
  
export const parseExerciseArguments = (args: string[]): number[] => {
  if (args.length < 4) throw new Error('Not enough arguments');

  args.slice(2).forEach(function (value) {
      if (isNaN(Number(value))) {
          throw new Error('Provided values were not numbers!');
      }
    });

    return args.slice(2).map(Number);

};

const calculateExercises = (values: number[]): ResultValues => {
  const target = values[0];
  const dayArray = values.slice(1);
  const periodLength = dayArray.length;
  const trainingDays = dayArray.reduce((elements, arr) => {if (arr > 0) { return elements + 1;} return elements;}, 0);
  const average = dayArray.reduce((a,b)=>a+b,0)/periodLength||0;
  const success = average >= target;
  const rating = success ? (average > target ? 3 : 2) : 1;
  const ratingDescription = rating===3 ? `You exceeded the target` : (rating===2 ? `You met the target` : `You did not meet the target`);
  return {
      periodLength: periodLength,
      trainingDays: trainingDays,
      success: success,
      rating: rating,
      ratingDescription: ratingDescription,
      target: target,
      average: average,
  };
};

if (process.argv.length > 2) {
  console.log(process.argv[0].length);
  try {
    const values = parseExerciseArguments(process.argv);
    console.log(calculateExercises(values));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    console.log(process.argv[0]);
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}

export default calculateExercises;