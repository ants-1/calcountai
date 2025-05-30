export interface UserType {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  password: string;
  gender?: string;
  goal?: string;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel?: string;
  weightHistory?: { weight: number; date: Date }[];
  height?: string;
  dateOfBirth?: string;
  streak?: number;
  dailyLogs?: [];
  challenges?: []; 
}

