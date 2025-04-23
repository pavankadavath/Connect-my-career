import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { toast } from 'react-toastify';
import './RecruiterCampusDrives.css';
import { Link } from 'react-router-dom';
import ConductDrives from './ConductDrives/ConductDrives';

function CampusDrives() {
  const [campusDrives, setCampusDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing campus drives
  useEffect(() => {
    const fetchCampusDrives = async () => {
      try {
        const recruiter = JSON.parse(localStorage.getItem('recruiterInfo'));
        const url = `/campus-api/getdrives/${recruiter.recruiterId}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch drives');
        
        const data = await response.json();

        if (data.campusDrives) {
          setCampusDrives(data.campusDrives);
        } else {
          setCampusDrives([]);
        }
        // console.log(campusDrives)
      } catch (error) {
        console.error('Error fetching campus drives:', error);
        setCampusDrives([]);
        toast.error('Failed to fetch campus drives', {
          position: 'top-center',
          autoClose: 2000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampusDrives();
  }, []);
  
  return (
    <div className="recruiter-campus-drives-container">
      <Navbar />
      <div className="recruiter-campus-drives-content">
        <div className="post-drive-section">
          <h2>Post a New Campus Drive</h2>
          <ConductDrives />
        </div>

        <div className="my-drives-section">
          <h2>My Campus Drives</h2>
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading drives...</p>
            </div>
          ) : campusDrives.length === 0 ? (
            <div className="no-drives-message">
              <p>No campus drives found. Start by posting a new campus drive.</p>
            </div>
          ) : (
            <div className="drives-list">
              {campusDrives.map((drive) => (
                <div key={drive._id} className="my-job-card">
                <div className="my-company-details">
                  {/* Company Logo */}
                  <img className="my-company-image" src={drive.companyImageUrl || ""} alt="Company Logo" />
                  <div className="my-company-info">
                    <h3 className="my-company-name">Company : {drive.companyName || "N/A"}</h3>
                    <p className="my-position">College Name : {drive.collegeName || "N/A"}</p>

                    <p className="my-position">Position : {drive.jobDetails?.positionName || "N/A"}</p>
                    <p className="my-job-type">Type : {drive.jobDetails?.jobType || "N/A"}</p>
                  </div>
                </div>
              
                <div className="my-job-description">
                  <p className="my-about-job">
                    <span className="my-about-job-heading">About : </span>
                    {drive.jobDetails?.aboutJob || "N/A"}
                  </p>
                  <p className="my-about-job">
                    <span className="my-about-job-heading">Responsibilities : </span>
                    {drive.jobDetails?.responsibilities || "N/A"}
                  </p>
                  <p className="my-about-job">
                    <span className="my-about-job-heading">Selection Process : </span>
                    {drive.selectionProcess || "N/A"}
                  </p>
                  <p className="my-about-job">
                    <span className="my-about-job-heading">Salary $ : </span>
                      {drive.jobDetails?.ctc || "N/A"}
                    </p>
                </div>
                
                <div className="my-dates">
                  <p className="my-last-date">
                    Deadline: {drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString() : "N/A"}
                  </p>

                  <Link to={`/recruiter/campusdrives/applications/${drive._id}`}>
                    <button className="my-applications-button">Applications</button>
                  </Link>

                  {/* Button to view details */}
                  <Link to={`/recruiter/campusdrives/${drive._id}`}>
                    <button className="my-applications-button">View More Details</button>
                  </Link>
                </div>
              </div>
              
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampusDrives;
