export interface CommunityType {
  _id: string;
  name: string;
  description: string;
  members: { _id: string; firstName: string; lastName: string }[];
  createdBy?: string;
  challenges?: [];
}
