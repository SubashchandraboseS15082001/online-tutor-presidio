import mongoose from "mongoose";
const { Schema, model } = mongoose;

const tutorSchema = new Schema({
  name: String,
  email: String,
  subjects: [String],
  location: String,
  password: String,
  notification: [{type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}],
});

const Tutor = model("Tutor", tutorSchema);
export default Tutor;
