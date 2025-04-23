
const express=require('express')
// const jwt=require('jsonwebtoken')
const expressAsyncHandler =require('express-async-handler')
const campusRoutes=express.Router();

const Recruiter = require("../models/Recruiter");
const Job=require("../models/Job");
const User=require("../models/User");
const AppliedJob=require("../models/AppliedJob");
const CampusDrive=require('../models/CampusDriveSchema')
const CampusDriveApplication=require('../models/CampusDriveApplicationSchema')
// Adjust the path to your model  files accordingly

campusRoutes.post('/postdrive', expressAsyncHandler(async (req, res) => {
  try {
    // Destructure the request body
    const {
      recruiterId,
      collegeCode,
      collegeName,
      companyName,
      companyImageUrl,
      eligibilityCriteria,
      jobDetails,
      selectionProcess,
      status,
      applicationDeadline
    } = req.body;

    // Create a new Campus Drive document
    const newCampusDrive = new CampusDrive({
      recruiterId,
      collegeCode,
      collegeName,
      companyName,
      companyImageUrl,
      eligibilityCriteria: {
        minCGPA: eligibilityCriteria?.minCGPA || 6,
        maxBacklogs: eligibilityCriteria?.maxBacklogs || 0,
        graduationYear: eligibilityCriteria?.graduationYear || 2025,
        allowedBranches: eligibilityCriteria?.allowedBranches || []
      },
      jobDetails: {
        positionName: jobDetails.positionName,
        jobType: jobDetails.jobType,
        ctc: jobDetails.ctc,
        aboutJob: jobDetails.aboutJob,
        responsibilities: jobDetails.responsibilities
      },
      selectionProcess: Array.isArray(selectionProcess) 
        ? selectionProcess 
        : [selectionProcess],
      status: status || 'Upcoming',
      applicationDeadline: new Date(applicationDeadline)
    });
    
    // Save the document
    const savedCampusDrive = await newCampusDrive.save();
    // console.log(`new Campus drive at server ${savedCampusDrive}`)
    // Respond with the saved document
    res.status(201).json({
      message: 'Campus Drive created successfully',
      campusDrive: savedCampusDrive
    });
  } catch (error) {
    console.error('Error creating campus drive:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    // Handle other errors
    res.status(500).json({
      message: 'Server error while creating campus drive',
      error: error.message
    });
  }
}));


campusRoutes.get('/getdrives/:recruiterId', expressAsyncHandler(async (req, res) => {
  try {
    const { recruiterId } = req.params;

    // Find all campus drives where recruiterId matches
    const campusDrives = await CampusDrive.find({ recruiterId });
    // console.log(campusDrives)
    if (campusDrives.length === 0) {
      return res.status(404).json({ message: 'No campus drives found for this recruiter' });
    }

    res.status(200).json({
      message: 'Campus drives fetched successfully',
      campusDrives
    });
  } catch (error) {
    console.error('Error fetching campus drives:', error);
    res.status(500).json({
      message: 'Server error while fetching campus drives',
      error: error.message
    });
  }
}));


// Route to get a specific drive by ID
campusRoutes.get('/getdrive/:driveId', expressAsyncHandler(async (req, res) => {
    try {
        const { driveId } = req.params;
        
        // Find the drive in the database
        const drive = await CampusDrive.findById(driveId);
        if (!drive) {
            return res.status(404).json({ message: 'Drive not found' });
        }
        // console.log(drive)

        res.status(200).json({ success: true, drive });

    } catch (error) {
        console.error('Error fetching drive:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));


// Update a campus drive
campusRoutes.put("/editdrive/:driveId", async (req, res) => {
  try {
    const { driveId } = req.params;
    const updatedDrive = await CampusDrive.findByIdAndUpdate(driveId, req.body, { new: true });

    if (!updatedDrive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.json({ message: "Drive updated successfully", drive: updatedDrive });
  } catch (error) {
    res.status(500).json({ message: "Error updating drive", error: error.message });
  }
});


// Delete a campus drive
campusRoutes.delete("/deletedrive/:driveId",expressAsyncHandler(async (req, res) => {
  try {
    const { driveId } = req.params;
    const deletedDrive = await CampusDrive.findByIdAndDelete(driveId);

    if (!deletedDrive) {
      return res.status(404).json({ message: "Drive not found" });
    }
    res.json({ message: "Drive deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting drive", error: error.message });
  }
}));


campusRoutes.get("/campus-drives", expressAsyncHandler(async (req, res) => {
  try {
    const { collegeCode, studentId } = req.query;
    if (!collegeCode || !studentId) {
      return res.status(400).json({ message: "College code and student ID are required" });
    }

    const today = new Date();

    // Get all drives for the college that are still active (not expired)
    const allDrives = await CampusDrive.find({
      collegeCode,
      lastDate: { $gte: today } // 💡 filter out expired drives
    });

    const appliedApplications = await CampusDriveApplication.find({ studentId }).select("campusDriveId applicationStatus");

    const appliedDriveIds = new Set(appliedApplications.map((app) => app.campusDriveId.toString()));

    // Filter out applied drives from the list of all active drives
    const campusDrives = allDrives.filter((drive) => !appliedDriveIds.has(drive._id.toString()));

    // Fetch full data of applied drives
    const appliedDrives = await CampusDrive.find({
      _id: { $in: [...appliedDriveIds] }
    });

    const appliedDrivesWithStatus = appliedDrives.map((drive) => {
      const application = appliedApplications.find(
        (app) => app.campusDriveId.toString() === drive._id.toString()
      );
      return {
        ...drive.toObject(),
        applicationStatus: application ? application.applicationStatus : "Applied"
      };
    });

    res.status(200).json({
      message: "Campus drives fetched successfully",
      drives: campusDrives,               
      appliedDrives: appliedDrivesWithStatus, 
    });
  } catch (error) {
    console.error("Error fetching campus drives:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));


// POST route to apply for a campus drive
campusRoutes.post('/apply-campusDrive', expressAsyncHandler(async (req, res) => {
    try {
        const { userId, jobId, recruiterId, collegeCode, status, appliedOn } = req.body;

        // Validate required fields
        if (!userId || !jobId || !recruiterId || !collegeCode || !status) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create a new application
        const newApplication = new CampusDriveApplication({
            studentId: userId,
            campusDriveId: jobId,
            recruiterId,
            collegeCode,
            applicationStatus: status,
            appliedAt: appliedOn || Date.now()
        });

        // Save to database
        await newApplication.save();
        // console.log(newApplication)
        res.status(201).json({ message: 'Application submitted successfully', application: newApplication });

    } catch (error) {
        console.error('Error applying for campus drive:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));

campusRoutes.get('/applications/:driveId', expressAsyncHandler(async (req, res) => {
  try {
    const { driveId } = req.params;
    const recruiterId = req.headers.recruiterid || req.body.recruiterId; // Fetch recruiterId from headers or body

    if (!recruiterId) {
      return res.status(400).json({ message: "Recruiter ID is required" });
    }

    // console.log("Drive ID:", driveId, "Recruiter ID:", recruiterId);
    const companyDetails = await Recruiter.findById(recruiterId).select("companyName companyImageUrl collegeCode collegeName");
    if (!companyDetails) {
      return res.status(404).json({ message: "Company not found" });
    }
    // console.log("Company Details:", companyDetails);

    const applications = await CampusDriveApplication.find({
      campusDriveId: driveId,
      recruiterId: recruiterId,
    }).populate("studentId", "username email address skills isStudent studentDetails collegeCode educationDetails resumeUrl");

    // console.log("Applications:", applications);
    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this campus drive" });
    }
    // console.log("Applications:", applications);
    res.status(200).json({ applications, companyDetails });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
}));


// Update application status by driveId, studentId
campusRoutes.patch("/applications/update/:driveId/:studentId", expressAsyncHandler(async (req, res) => {

  try {
    const { driveId, studentId } = req.params;
    const { applicationStatus } = req.body;
    const recruiterId = req.headers.recruiterid; // Get recruiterId from headers
    // console.log(driveId,studentId,applicationStatus,recruiterId)
    if (!recruiterId) {
      return res.status(401).json({ message: "Unauthorized: Recruiter ID missing" });
    }

    // Find the application by driveId, studentId, and recruiterId
    const application = await CampusDriveApplication.findOne({
      campusDriveId: driveId,
      studentId: studentId,
      recruiterId: recruiterId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update the application status
    application.applicationStatus = applicationStatus;
    await application.save();
    // console.log(application)
    res.status(200).json({ message: "Application status updated successfully", application });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}));



campusRoutes.delete("/withdraw-application/:driveId", expressAsyncHandler(async (req, res) => {
  try {
    const { driveId } = req.params;
    const studentId = req.headers.studentid; // Extract from headers


    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // Remove the application from CampusDriveApplication
    const result = await CampusDriveApplication.findOneAndDelete({
      campusDriveId: driveId,
      studentId: studentId,
    });

    if (!result) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}));


module.exports = campusRoutes;