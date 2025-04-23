import React, { useState } from "react";
import { toast } from "react-toastify";
import "./AppliedCampusDrives.css";

const AppliedCampusDrives = ({ drive, onWithdraw }) => {
  const [showDetails, setShowDetails] = useState(false);
  // console.log(drive)
  const handleWithdraw = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo || !userInfo.userId) {
        console.error("User information not found in localStorage");
        return;
      }

      const response = await fetch(`http://localhost:5000/campus-api/withdraw-application/${drive._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userInfo.token}`,
          "studentId": userInfo.userId,
        },
      });

      if (!response.ok) throw new Error("Failed to withdraw application");

      toast.success("Application withdrawn successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      onWithdraw(drive._id);
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error("Failed to withdraw application", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="applied-drive-card">
      {/* Company Details */}
      <div className="applied-drive-details">
        <div className="company-details">
          <p><strong>Company :</strong> {drive.companyName}</p>
          <p><strong>College:</strong> {drive.collegeName}</p>
        </div>
        <div className="company-logo">
          <img src={drive.companyImageUrl} alt="company-logo" />
        </div>
      </div>
      <p className="about-job"><strong>About :</strong>{drive.jobDetails?.aboutJob || "N/A"}</p>
      {/* Job Details */}
      <div className="applied-drive-header">
        <p><strong>Role :</strong> {drive.jobDetails?.positionName || "N/A"}</p>
        <p className="applied-job-type"><strong>Job type :</strong> {drive.jobDetails?.jobType || "N/A"}</p>
        <p><strong>CTC :</strong> {drive.jobDetails?.ctc || "N/A"} LPA</p>
      </div>

      <div className="card-bottom">
        <p className="application-status"><strong>Application Status:</strong> {drive.applicationStatus || "Applied"}</p>
        <p className="deadline"><strong>Deadline:</strong> {new Date(drive.applicationDeadline).toLocaleDateString()}</p>
      </div>
      {/* Action Buttons */}
      <div className="applied-drive-actions">
        <button className="view-details-button" onClick={() => setShowDetails(true)}>
          View Details
        </button>
        <button onClick={handleWithdraw} className="withdraw-button">
          Withdraw Application
        </button>
      </div>

      {/* Floating Popup for Details */}
      {showDetails && (
        <div className="popup-overlay" onClick={() => setShowDetails(false)}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <h2>{drive.companyName} - {drive.jobDetails?.positionName}</h2>
            <p><strong>Job Type :</strong>{drive.jobDetails?.jobType || "N/A"}</p>
            <p><strong>CTC :</strong> {drive.jobDetails?.ctc} LPA</p>
            <p><strong>About Job :</strong> {drive.jobDetails?.aboutJob || "N/A"}</p>
            <p><strong>Responsibilities :</strong> {drive.jobDetails?.responsibilities || "N/A"}</p>
            <p><strong>Application Status:</strong> {drive.applicationStatus}</p>
            <p><strong>Deadline:</strong> {new Date(drive.applicationDeadline).toLocaleDateString()}</p>

            <button className="close-popup-button" onClick={() => setShowDetails(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedCampusDrives;
