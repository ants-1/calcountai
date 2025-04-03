import { useContext } from "react";
import { MealContext } from "@/context/MealContext";

export default function useMeal() {
    const context = useContext(MealContext);

    if (!context) {
        throw new Error("useMeal must be used within a MealProvider");
    }

    return context;
}