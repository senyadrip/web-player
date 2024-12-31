import mongoose, { Schema, Document} from "mongoose";

export interface IUser extends Document {
  discordId: string;
  username: string;
}

const UserSchema: Schema = new Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true }
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;