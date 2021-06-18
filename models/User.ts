import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  name: String,
  email: String,
  image: String,
  createdAt: String,
  updatedAt: String,
});

export default mongoose.models.User ?? mongoose.model("User", userSchema);