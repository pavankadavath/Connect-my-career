import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar'; // Import your Navbar component
// import ApplicantCard from '../ApplicantCard';
import NoApplicationsImage from "../../../assets/no-jobs-view.png";
import './index.css'; // Import the CSS file
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx/xlsx.mjs';


const JobApplicationDetailsPage = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState({});
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [allApplications, setAllApplications] = useState([]);
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/recruiter-api/job-applications/${jobId}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch job applications");
        }
        const data = await response.json();
        const { jobDetails, applications } = data;
        setJobDetails(jobDetails);
        setAllApplications(Array.isArray(applications) ? applications : []);
        setApplications(Array.isArray(applications) ? applications : []);
        
      } catch (error) {
        console.error("Error fetching job applications:", error);
        toast.error("Failed to fetch job applications.");
      }
    }
    fetchData();
  }, [jobId]);
  
  const handleStatusChange = async ( userId,status) => {
    try {
      const jobApplicationUpdationDetails = {
        jobId,
        userId,
        status,
      };
      const response = await fetch('/recruiter-api/update-application-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobApplicationUpdationDetails),
      });
      if (!response.ok) {
        throw new Error("Failed to update application status");
      }
      toast.success('User Application Status Updated!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      const updatedApplications = allApplications.map(user => {
        if (user.userId === userId) {
          return { ...user, status: status }; // Update the status of the user
        }
        return user;
      });
      setAllApplications(updatedApplications);
      handleFilter(filter); // Reapply the filter after updating the status

      // Send email to user about status change
      await fetch(`/email-api/job-notify/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus: status, jobDetails }),
      });
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status.");
    }
  };
  // console.log(jobDetails)

  const downLoadasSheet = () => {
    if (!applications.length) {
      toast.error("No applications to download.");
      return;
    }
    const fileName = `${jobDetails.companyName || "Job_Applications"}.xlsx`;
    const formattedData = applications.map((app, index) => ({
      S_No: index + 1,
      Name: app.username || "N/A",
      Email: app.email || "N/A",
      Application_Status: app.status || "N/A",
      Resume_URL: app.resume || "N/A",
      Applied_On: app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, fileName);

    toast.success("Applications downloaded successfully!");
  };

  const handleFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") {
      setApplications(allApplications); 
    } else {
      const filteredApplications = allApplications.filter(
        (app) => app.status === filter 
      );
      setApplications(filteredApplications);
    }
  };

  const viewResume = (resumeLink) => setResumeUrl(resumeLink);
  const closeResumePopup = () => setResumeUrl(null);

  return (
    <div className="job-application-details-container">
      <Navbar />
      <div className="applications-header">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          aria-label="Filter Applications By Status"
        >
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button onClick={downLoadasSheet} className="download-btn">
          Download
        </button>
      </div>

           {applications.length > 0 ? (
              <>
                <h2 className="applications-heading">Applications for Campus Drive</h2>
                <div className="applications-table-container">
                  <table className="applications-table">
                    <thead>
                      <tr>
                        <th>S no</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Selection</th>
                        <th>Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app, index) => (
                        <tr key={app.userId}>
                          <td>{index + 1}</td>
                          <td>{app.username || "N/A"}</td>
                          <td>{app.email || "N/A"}</td>
                          <td>{app.status || "N/A"}</td>
                          <td>
                            <select
                              value={app.status || "Applied"}
                              onChange={(e) =>
                                handleStatusChange( app.userId, e.target.value)
                              }
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Selected">Selected</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            {app.resume ? (
                              <button onClick={() => 
                              viewResume(app.resume)
                              }>
                                View Resume
                              </button>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="no-applications-container">
                <img src={NoApplicationsImage} alt="No Applications" className="no-applications-image" />
                <h2 className="no-applications-heading">No applications found for this drive.</h2>
              </div>
            )}

      {resumeUrl && (
        <div className="resume-modal">
          <button className="close-btn" onClick={closeResumePopup}>
            X
          </button>
          <div className="resume-container">
            <iframe
              src={resumeUrl}
              width="100%"
              height="600px"
              title="Resume Viewer"
              className="resume-image"
              style={{ border: "none" }}
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobApplicationDetailsPage;