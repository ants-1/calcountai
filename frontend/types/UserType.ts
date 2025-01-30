export interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  password: string;
  goal?: string;
  currentWeight?: number;
  targetWeight?: number;
  activityLevel?: string;
  height?: string;
  dateOfBirth?: string;
  streak?: number;
  pendingFriendRequests?: []; 
  friendRequests?: [];
  friends?: [];
  dailyLogs?: [];
  challenges?: []; 
}

