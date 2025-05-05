// Helper function to validate height
export const isValidHeight = (height: string, unit: "ft" | "cm"): boolean => {
    const heightValue = parseFloat(height);
  
    // Check if height is a valid number and greater than zero
    if (isNaN(heightValue) || heightValue <= 0) {
      return false;
    }
  
    if (unit === "ft" && (heightValue < 1 || heightValue > 8)) {
      return false; 
    }
  
    if (unit === "cm" && (heightValue < 30 || heightValue > 250)) {
      return false;
    }
  
    return true;
  };