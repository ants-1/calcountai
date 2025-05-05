// Helpder function to convert height
export const convertFeetToCm = (feet: number) => {
    return (feet * 30.48).toFixed(2);
};

export const convertCmToFeet = (cm: number) => {
    return (cm / 30.48).toFixed(2);
};
