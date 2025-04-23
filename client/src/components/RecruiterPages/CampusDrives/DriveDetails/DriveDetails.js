import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import './DriveDetails.css';

const DriveDetails = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriveDetails = async () => {
      try {
        const response = await fetch(`/campus-api/getdrive/${driveId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch drive details");
        }
        const data = await response.json();
        setDrive(data.drive);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDriveDetails();
  }, [driveId]);

  // Handle Delete Drive
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this drive?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/campus-api/deletedrive/${driveId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete drive");
      }

      alert("Drive deleted successfully!");
      navigate(`/recruiter/campusdrives`); // Redirect to Drive Details
    } catch (error) {
      alert(error.message);
    }
  };


  if (loading) return <p>Loading drive details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!drive) return <p>No Drive Details Available</p>;

  return (
    <div className="drive-details-container">
      <div className="drive-card">
        {/* Header - Company Info */}
        <div className="drive-header">
          <img className="company-logo" src={drive.companyImageUrl} alt={drive.companyName} />
          <div className="company-info">
            <h2><strong>Company : </strong>{drive.companyName}</h2>
            <p><strong>College Name : </strong>{drive.collegeName} ({drive.collegeCode})</p>
          </div>
        </div>

        {/* Job Details */}
        <div className="drive-body">
          <h3>Position: {drive.jobDetails?.positionName || "N/A"}</h3>
          <p><strong>Job Type:</strong> {drive.jobDetails?.jobType || "N/A"}</p>
          <p><strong>CTC $:</strong> {drive.jobDetails?.ctc || "N/A"}</p>
          <p><strong>Description:</strong> {drive.jobDetails?.aboutJob || "N/A"}</p>
          <p><strong>Responsibilities:</strong> {drive.jobDetails?.responsibilities || "N/A"}</p>
        </div>

        {/* Eligibility */}
        <div className="drive-eligibility">
          <h4>Eligibility Criteria</h4>
          <ul>
            <li>Graduation Year: {drive.eligibilityCriteria?.graduationYear || "N/A"}</li>
            <li>Minimum CGPA: {drive.eligibilityCriteria?.minCGPA || "N/A"}</li>
            {/* <li>Max Backlogs: {drive.eligibilityCriteria?.maxBacklogs || "N/A"}</li> */}
          </ul>
        </div>

        {/* Selection Process */}
        <div className="drive-selection">
          <h4>Selection Process</h4>
          <p>{drive.selectionProcess?.join(", ") || "N/A"}</p>
        </div>

        {/* Application Deadline & Status */}
        <div className="drive-footer">
          <p><strong>Deadline:</strong> {new Date(drive.applicationDeadline).toLocaleDateString()}</p>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="drive-actions">
           <Link to={`/recruiter/campusdrives/edit/${drive._id}`}>
              <button className="my-applications-button">Edit Drive</button>
            </Link>
          <button className="delete-button" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
