// Helper function to convert weights
export const convertStoneToKg = (stones: number) => {
    return (stones * 6.35).toFixed(2);
  };
  
  export const convertKgToStone = (kg: number) => {
    return (kg / 6.35).toFixed(2);
  };
  