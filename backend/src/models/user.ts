import mongoose, { Model, Schema, Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    password: string;
    goal?: string;
    currentWeight?: Number;
    targetWeight?: Number;
    activityLevel?: string;
    height?: string;
    dateOfBirth?: string;
    streak?: Number;
    pendingFriendRequests?: Types.ObjectId[];
    friendRequests?: Types.ObjectId[];
    friends?: Types.ObjectId[];
}

type UserModel = Model<IUser>;

const UserSchema = new Schema<IUser, UserModel>({
    firstName: { type: String, minlength: 1, maxlength: 100, required: true },
    lastName: { type: String, minlength: 1, maxlength: 100, required: true },
    email: { type: String, maxlength: 256, required: true, unique: true },
    avatar: { type: String },
    password: { type: String },
    goal: { type: String },
    currentWeight: { type: Number },
    targetWeight: { type: Number },
    activityLevel: { type: String },
    height: { type: String },
    dateOfBirth: { type: String },
    streak: { type: Number },
    pendingFriendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model<IUser, UserModel>('User', UserSchema);

