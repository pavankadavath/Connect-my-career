import React, { useEffect, useState, useRef } from "react";
import "./CampusApplications.css";
import { useParams } from "react-router-dom";
import Navbar from "../../Navbar";
import NoApplicationsImg from "../../../../assets/no-jobs-view.png";
import * as XLSX from "xlsx/xlsx.mjs";
import { toast } from "react-toastify";

const CampusApplications = () => {
  const [allApplications, setAllApplications] = useState([]); // Store all applications
  const [applications, setApplications] = useState([]); // Store filtered applications
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const { driveId } = useParams();
  const isFetched = useRef(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const recruiter = JSON.parse(localStorage.getItem("recruiterInfo"));
        if (!recruiter) {
          setError("Recruiter not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(`/campus-api/applications/${driveId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            recruiterId: recruiter.recruiterId,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch applications: ${response.statusText}`);
        }

        const data = await response.json();
        const { applications, companyDetails } = data;
        setAllApplications(Array.isArray(applications) ? applications : []); // Store all applications
        setApplications(Array.isArray(applications) ? applications : []); // Initially display all applications
        setCompanyDetails(companyDetails);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isFetched.current) {
      isFetched.current = true;
      fetchApplications();
    }
  }, [driveId]);

  const handleStatusChange = async (driveId, studentId, newStatus) => {
    try {
      const recruiter = JSON.parse(localStorage.getItem("recruiterInfo"));
      if (!recruiter) return;

      const response = await fetch(`/campus-api/applications/update/${driveId}/${studentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          recruiterId: recruiter.recruiterId,
        },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      setAllApplications((prev) =>
        prev.map((app) =>
          app.campusDriveId === driveId && app.studentId._id === studentId
            ? { ...app, applicationStatus: newStatus }
            : app
        )
      );

      // Reapply the filter after updating the status
      handleFilter(filter);

      toast.success("Application status updated successfully!");
    } catch (err) {
      console.error("Error updating application status:", err);
      toast.error("Failed to update application status.");
    }
  };

  const handleFilter = (filter) => {
    setFilter(filter);
    if (filter === "All") {
      setApplications(allApplications); 
    } else {
      const filteredApplications = allApplications.filter(
        (app) => app.applicationStatus === filter
      );
      setApplications(filteredApplications);
    }
  };

  const viewResume = (resumeLink) => setResumeUrl(resumeLink);
  const closeResumePopup = () => setResumeUrl(null);

  const downLoadasSheet = () => {
    if (!applications.length) {
      toast.error("No applications to download.");
      return;
    }
    const fileName = `${applications[0].collegeCode}_${companyDetails.companyName}.xlsx`;

    const formattedData = applications.map((app, index) => ({
      S_No: index + 1,
      Name: app.studentId?.username || "N/A",
      Email: app.studentId?.email || "N/A",
      College: app.studentId?.studentDetails?.collegeName || "N/A",
      Branch: app.studentId?.studentDetails?.branch || "N/A",
      Graduation_Year: app.studentId?.studentDetails?.graduationYear || "N/A",
      Application_Status: app.applicationStatus || "N/A",
      resumeUrl: app.studentId?.resumeUrl || "N/A",
      Applied_On: app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, fileName);

    toast.success("Downloaded successfully!");
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="applications-container">
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
                  <th>College</th>
                  <th>Branch</th>
                  <th>Graduation Year</th>
                  <th>Status</th>
                  <th>Applied On</th>
                  <th>Selection</th>
                  <th>Resume</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app._id}>
                    <td>{index + 1}</td>
                    <td>{app.studentId?.username || "N/A"}</td>
                    <td>{app.studentId?.email || "N/A"}</td>
                    <td>{app.studentId?.studentDetails?.collegeName || "N/A"}</td>
                    <td>{app.studentId?.studentDetails?.branch || "N/A"}</td>
                    <td>{app.studentId?.studentDetails?.graduationYear || "N/A"}</td>
                    <td>{app.applicationStatus || "N/A"}</td>
                    <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}</td>
                    <td>
                      <select
                        value={app.applicationStatus || "Applied"}
                        onChange={(e) =>
                          handleStatusChange(app.campusDriveId, app.studentId._id, e.target.value)
                        }
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      {app.studentId?.resumeUrl ? (
                        <button onClick={() => viewResume(app.studentId.resumeUrl)}>
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
          <img src={NoApplicationsImg} alt="No Applications" className="no-applications-image" />
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

export default CampusApplications;
