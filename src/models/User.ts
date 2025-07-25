import mongoose, { Schema } from "mongoose";
interface IUser {
  handle: string;
  name: string;
  email: string;
  password: string;
}
const userSchema = new Schema({
  //atributos
  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
})
//creamos el modelo
const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;