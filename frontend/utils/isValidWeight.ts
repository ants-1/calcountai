// Helper function to validate weight
export const isValidWeight = (input: string, unit: "st" | "kg"): boolean => {
    const parsedWeight = parseFloat(input);
    if (unit === "kg") {
      // Valid range for kg: 1 - 500 kg
      return !isNaN(parsedWeight) && parsedWeight > 1 && parsedWeight <= 500;
    } else if (unit === "st") {
      // Valid range for stone: 1 - 78 st (78 st is approximately 500 kg)
      return !isNaN(parsedWeight) && parsedWeight > 1 && parsedWeight <= 78;
    }
    return false;
  };
  