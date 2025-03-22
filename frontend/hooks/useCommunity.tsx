import { useContext } from "react";
import { CommunityContext } from "@/context/CommunityContext";

export default function useCommunity() {
  const context = useContext(CommunityContext);
  
  if (!context) {
    throw new Error("useCommunity must be used within a CommunityProvider");
  }

  return context;
}
