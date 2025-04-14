import { ParticipantType } from "./ParticipantType";

export interface ChallengeType {
    _id: string;
    name: string;
    level: number;
    description: string;
    percentage: number;
    participants?: [ParticipantType];
    completed: boolean;
    challengeType: "Streak" | "Meal" | "Activity" | "Goal" ;
}