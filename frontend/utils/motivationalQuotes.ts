export const motivationalQuotes = [
  "You don't have to be great to start, but you have to start to be great.",
  "Success starts with self-discipline.",
  "Push yourself because no one else is going to do it for you.",
  "The only bad workout is the one that didn’t happen.",
  "Believe you can and you're halfway there.",
  "Discipline is doing what needs to be done, even if you don’t want to.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Strive for progress, not perfection.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Don’t limit your challenges — challenge your limits.",
  "It’s not about having time. It’s about making time.",
  "Results happen over time, not overnight. Work hard, stay consistent, and be patient.",
  "Fitness is not about being better than someone else. It's about being better than you used to be.",
  "No excuses. Just results.",
  "You’re only one workout away from a good mood."
];

// Get the quote of the day
export const getQuoteOfTheDay = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
      Date.UTC(today.getFullYear(), 0, 0)) /
      86400000
  );
  const index = dayOfYear % motivationalQuotes.length;
  return motivationalQuotes[index];
};
