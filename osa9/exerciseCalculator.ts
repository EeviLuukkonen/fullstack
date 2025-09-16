
interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export type dailyExcerciseHours = number[];

interface Arguments {
  dailyExcerciseHours: dailyExcerciseHours;
  target: number;
}

export const calculateExercises = (dailyExcerciseHours: Array<number>, target: number): Result => {
  // [3, 0, 2, 4.5, 0, 3, 1]
  const periodLength = dailyExcerciseHours.length;
  const trainingDays = dailyExcerciseHours.filter(a => a > 0).length;
  const average = dailyExcerciseHours.reduce((a, b) => a + b) / periodLength;
  
  let rating: number;
  let success: boolean = false;
  let ratingDescription: string;
  if (average >= target) {
    rating = 3;
    success = true;
    ratingDescription = "Well done, target reached";
  } else if (target - average <= 1) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "You can do better";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNumber = (argument: any): boolean =>
  !isNaN(Number(argument));

const parseArguments = (args: string[]): Arguments => {
  if (args.length < 4) throw new Error('Not enough arguments. Target and at least one training day required');

  const target = Number(args[2]);
  if (!isNumber(target)) {
    throw new Error('Target must be a number!');
  }
  
  const dailyExcerciseHours: number[] = [];
  args.slice(3).forEach(arg => {
    if (!isNumber(arg)) {
      throw new Error(`${arg} is not a number!`);
    } else {
      dailyExcerciseHours.push(Number(arg));
    }
  });

  return {
    target,
    dailyExcerciseHours,
  };
};

if (require.main === module) {
  try {
    const { target, dailyExcerciseHours } = parseArguments(process.argv);
    console.log(dailyExcerciseHours, target);
    console.log(calculateExercises(dailyExcerciseHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Error occurred.';
    if (error instanceof Error) {
      errorMessage += ' Details: ' + error.message;
    }
    console.log(errorMessage);
  }
}