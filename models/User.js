import mongoose, { Schema } from "mongoose";


// This is the model that nextauth uses that I don't know how to extend
// This model is purely for queries
const userSchema = new Schema({
  name: String,
  email: String,
  image: String,
  createdAt: String,
  updatedAt: String,
});

export default mongoose.models.User || mongoose.model("User", userSchema);