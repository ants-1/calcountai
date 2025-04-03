// Helper function to validate the date
export const isValidDate = (day: string, month: string, year: string) => {
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);

  // Check for valid day, month, and year
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
    return false;
  }

  // Check for valid month
  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  // Check for valid day depending on the month
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) {
    return false;
  }

  // Check for realistic age (e.g., not too old or future date)
  const currentYear = new Date().getFullYear();
  if (yearNum > currentYear || yearNum < currentYear - 120) {
    return false;
  }

  return true;
};
