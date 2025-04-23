const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const Recruiter = require("../models/Recruiter"); // Assuming you have a Recruiter model
require("dotenv").config();
const CampusDriveSchema=require('../models/CampusDriveSchema')

const emailApp = express.Router();

let otpStorage = {}; // Temporary storage for OTPs

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.PASS, // Your email password or App Password
    },
});

// Generate OTP and send via email
emailApp.post("/generate-otp", async (req, res) => {
    const { email } = req.body;

    // Check if the email already exists in User or Recruiter collections
    const existingUser = await User.findOne({ email });
    const existingRecruiter = await Recruiter.findOne({ email });

    if (existingUser || existingRecruiter) {
        return res.status(200).send({ message: "User or Recruiter with the same email already exists" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStorage[email] = otp;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Your OTP for Registration in Connect My Career",
        text: `Your OTP is: ${otp}.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error sending OTP", error });
    }
});

// Verify OTP
emailApp.post("/verify-otp", (req, res) => {
    const { email, enteredOTP } = req.body;

    if (otpStorage[email] && otpStorage[email] == enteredOTP) {
        delete otpStorage[email]; // OTP verified, remove it
        res.json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
});


emailApp.post("/notify/:studentId", async (req, res) => {
  const { studentId } = req.params;
  const { newStatus,driveId } = req.body;

  try {
    const student = await User.findById(studentId);
    const drive=await CampusDriveSchema.findById(driveId);

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    // console.log(drive);

    const mailOptions = {
      from: process.env.EMAIL,
      to: student.email,
      subject: "Application Status Update",
      text: `Dear ${student.username},\n\nYour application status has been updated to: ${newStatus}.
      \n\nDrive Details:\nTitle: ${drive.jobDetails.positionName}\nCompany Name :${drive.companyName}\nDescription: ${drive.jobDetails.aboutJob}\nCollege: ${drive.collegeName}\n\nBest regards,\nConnect My Career Team`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});


// Endpoint to send email notification about status change
emailApp.post("/job-notify/:userId", async (req, res) => {
  const { userId } = req.params;
  const { newStatus, jobDetails } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Application Status Update",
      text: `Dear ${user.username},\n\nYour application status has been updated to: ${newStatus}.\n\nJob Details:\nPosition: ${jobDetails.positionName}\nJob Type: ${jobDetails.jobType}\nAbout: ${jobDetails.aboutJob}\nMinimum Qualifications: ${jobDetails.minQualifications}\nResponsibilities: ${jobDetails.responsibilities}\nCTC: ${jobDetails.ctc}\nPosted On: ${new Date(jobDetails.postedOn).toLocaleDateString()}\nLast Date: ${new Date(jobDetails.lastDate).toLocaleDateString()}\n\nBest regards,\nConnect My Career Team`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});

module.exports = emailApp;