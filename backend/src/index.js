import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Student from "./model/student.js";
import Tutor from "./model/Tutor.js";
import Notification from "./model/Notification.js";

const PORT = process.env.PORT || 9000;

const SUCCESS = 0;
const FAILURE = 1;
const STUDENT = "student";
const TUTOR = "tutor";

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://admin:subash%40123@cluster0.stqlr.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    //STUDENT

    app.post("/signin", async (req, res) => {
      const { email, password, type } = req.body;

      if (type == STUDENT) {
        const existingStudent = await Student.findOne({ email }).exec();
        if (!existingStudent) {
          res.send({ message: "User not found", status: FAILURE });
          return;
        }

        if (existingStudent.password !== password) {
          res.send({ message: "Invalid password", status: FAILURE });
          return;
        }

        res.send({ data: existingStudent, status: SUCCESS });
        return;
      }

      if (type == TUTOR) {
        const existingTutor = await Tutor.findOne({ email }).exec();
        if (!existingTutor) {
          res.send({ message: "User not found", status: FAILURE });
          return;
        }

        if (existingTutor.password !== password) {
          res.send({ message: "Invalid password", status: FAILURE });
          return;
        }

        res.send({ data: existingTutor, status: SUCCESS });
        return;
      }

      res.send({ message: "Invalid type", status: FAILURE });
    });

    app.post("/signup", async (req, res) => {
      const { name, email, password, type } = req.body;

      if (type == STUDENT) {
        const existingStudent = await Student.findOne({ email }).exec();
        if (existingStudent) {
          res.send({ message: "Student already exists", status: FAILURE });
          return;
        }

        const student = new Student({ name, email, password });
        await student.save();
        res.send({ data: student, status: SUCCESS });
        return;
      }

      if (type == TUTOR) {
        const { location, subjects } = req.body;
        const existingTutor = await Tutor.findOne({ email }).exec();
        if (existingTutor) {
          res.send({ message: "Tutor already exists", status: FAILURE });
          return;
        }

        const tutor = new Tutor({
          name,
          email,
          password,
          subjects,
          location,
          notification: [],
        });

        await tutor.save();
        res.send({ data: tutor, status: SUCCESS });
        return;
      }

      res.send({ message: "Invalid type", status: FAILURE });
    });

    app.get("/search", async (req, res) => {
      const { location, subject, name } = req.query;

      const tutors = [];
      if (name) {
        const res = await Tutor.find({
          name: name,
        })
          .select("-notification")
          .exec();
        tutors.push(...res);
      }

      if (subject) {
        const res = await Tutor.find({
          subjects: subject,
        })
          .select(["-notification", "-password"])
          .exec();
        tutors.push(...res);
      }

      if (location) {
        const res = await Tutor.find({
          location: location,
        })
          .select(["-notification", "-password"])
          .exec();
        tutors.push(...res);
      }

      res.send({ data: { tutors, count: tutors.length }, status: SUCCESS });
    });

    app.post("/notification", async (req, res) => {
      const { tutorEmail, email } = req.body;

      const student = await Student.findOne({ email }).exec();
      if (!student) {
        res.send({ message: "Student not found", status: FAILURE });
        return;
      }

      const tutor = await Tutor.findOne({ email: tutorEmail }).exec();
      console.log({ tutor, tutorEmail });
      if (!tutor) {
        res.send({ message: "Tutor not found", status: FAILURE });
        return;
      }
      const date = new Date();
      const notification = new Notification({
        student,
        message: "New notification received on " + date.toGMTString(),
      });
      await notification.save();
      await tutor.update({
        notification: [...tutor.notification, notification],
      });
      res.send({ message: "Notification sent", status: SUCCESS });
    });

    app.get("/notification", async (req, res) => {
      const { email } = req.query;
      let tutor = await Tutor.findOne({ email })
        .populate({
          path: "notification",
          populate: { path: "student", model: "Student" },
        })
        .select("-password")
        .exec();
      if (!tutor) {
        res.send({ message: "Tutor not found", status: FAILURE });
        return;
      }

      res.send({ data: tutor.notification, status: SUCCESS });
    });

    app.listen(PORT, () => {
      console.log("Server started");
    });
  })
  .catch((e) => {
    console.log("Failed to start server : " + e);
  });
