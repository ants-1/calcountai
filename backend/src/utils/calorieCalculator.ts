const getAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const calorieCalculator = ({
  weight,
  height,
  dateOfBirth,
  gender,
  activityLevel,
}: {
  weight: number;
  height: number;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  activityLevel:
    | 'Sedentary: little or no exercise'
    | 'Light: exercise 1-3 times/week'
    | 'Moderate: exercise 4-5 times/week'
    | 'Active: daily exercises';
}) => {
  const age = getAge(dateOfBirth);
  let bmr;

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    const maleBmr = 10 * weight + 6.25 * height - 5 * age + 5;
    const femaleBmr = 10 * weight + 6.25 * height - 5 * age - 161;
    bmr = (maleBmr + femaleBmr) / 2;
  }

  const activityMultipliers: Record<string, number> = {
    'Sedentary: little or no exercise': 1.2,
    'Light: exercise 1-3 times/week': 1.375,
    'Moderate: exercise 4-5 times/week': 1.55,
    'Active: daily exercises': 1.725,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;

  const dailyCalories = bmr * multiplier;

  return Math.round(dailyCalories);
};
