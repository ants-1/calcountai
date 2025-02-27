export interface ChallengeType {
    _id: string;
    name: string;
    description: string;
    percentage: number;
    participants?: [string];
    completed: boolean;
    startDate?: Date;
    endDate?: Date;
    challengeType: string;
}