
interface Arguments {
  height: number;
  weight: number;
}

export const calculateBmi = (height: number, weight: number) => {
  const heightCm = height / 100
  const bmi = weight / (heightCm * heightCm)
  console.log(bmi)

  if (bmi < 18.5) {
    return "Underweight :("
  } else if (bmi >= 18.5 && bmi < 25) {
    return "Normal range"
  } else if (bmi >= 25) {
    return "Overweight :("
  }
}

const parseArguments = (args: string[]): Arguments => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight))
} catch (error: unknown) {
  let errorMessage = 'Error occurred.'
  if (error instanceof Error) {
    errorMessage += ' Details: ' + error.message;
  }
  console.log(errorMessage);
}
