import mongoose from "mongoose";
const { Schema, model } = mongoose;
const studentSchema = new Schema({
  name: String,
  email: String,
  password: String,
});

const Student = model("Student", studentSchema);
export default Student;
