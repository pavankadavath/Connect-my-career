import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UserCampusJobCard.css";

function UserCampusJobCard({ drive, userData, setAppliedDrives }) {
  // State to track if the user has already applied
  const [hasApplied, setHasApplied] = useState(false);
  
  
  const handleApply = async (e) => {
    e.preventDefault();

    const applyData = {
      userId: userData.userId,
      jobId: drive._id,
      recruiterId: drive.recruiterId,
      collegeCode: drive.collegeCode,
      status: "Applied",
      appliedOn: new Date(),
    };

    try {
      const response = await fetch('/campus-api/apply-campusDrive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applyData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Application submitted successfully!");
        setHasApplied(true);
        setAppliedDrives(prev => [...prev, applyData]); // Add to applied drives list
      } else {
        toast.error(data.message || "Failed to apply. Please try again.");
      }
    } catch (error) {
      // toast.error("Error submitting application. Please check your network.");
      console.error('Error:', error);
    }
  };

  return (
    <div className="drive-card">
      <div className="drive-header">
        <div className="company-logo">
          <img src={drive.companyImageUrl || "default-logo.png"} alt={`${drive.companyName} Logo`} />
        </div>
        <div className="company-info">
          <h3 className="company-name">{drive.companyName}</h3>
          <p className="position">Role: {drive.jobDetails.positionName}</p>
          <span className="job-type">Job Type: {drive.jobDetails.jobType}</span>
        </div>
      </div>

      <div className="drive-section">
        <h4>About the Job:</h4>
        <p>{drive.jobDetails.aboutJob}</p>
      </div>

      <div className="drive-section">
        <h4>Responsibilities:</h4>
        <p>{drive.jobDetails.responsibilities}</p>
      </div>

      <div className="drive-section">
        <span className="ctc">Package CTC : {drive.jobDetails.ctc}</span>
      </div>

      <div className="eligibility-grid">
        <p className="eligibility-item"><span>Min CGPA : </span>{drive.eligibilityCriteria.minCGPA}</p>
        <p className="eligibility-item"><span>Max Backlogs : </span>{drive.eligibilityCriteria.maxBacklogs}</p>
        <p className="eligibility-item"><span>Graduation Year : </span>{drive.eligibilityCriteria.graduationYear}</p>
      </div>

      <div className="drive-section">
        <span className="selection">Selection Process: {drive.selectionProcess}</span>
      </div>

      <div className="drive-dates">
        <span>Posted: {new Date(drive.createdAt).toLocaleDateString()}</span>
        <span>Deadline: {new Date(drive.applicationDeadline).toLocaleDateString()}</span>
      </div>

      <button 
        className={`apply-button ${hasApplied ? "applied" : ""}`} 
        onClick={handleApply} 
        disabled={hasApplied}
      >
        {hasApplied ? "Applied" : "Apply Now"}
      </button>
    </div>
  );
}

export default UserCampusJobCard;
