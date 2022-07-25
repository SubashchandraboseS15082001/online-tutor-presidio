import Student from "./student.js";

import mongoose from "mongoose";
const { Schema, model } = mongoose;

const notificationSchema = new Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  message: String,
});

const Notification = model("Notification", notificationSchema);
export default Notification;
