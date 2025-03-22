import { ChallengeContext } from "@/context/ChallengeContext";
import { useContext } from "react";

export default function useChallenge() {
  const context = useContext(ChallengeContext);

  if (!context) {
    throw new Error("useChallenge must be used within a ChallengeProvider");
  }
  
  return context;
}