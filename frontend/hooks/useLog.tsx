import { useContext } from "react";
import { LogContext } from "@/context/LogContext";

export default function useLog() {
    const context = useContext(LogContext);

    if (!context) {
        throw new Error("useLog must be used within a LogProvider");
    }

    return context;
}