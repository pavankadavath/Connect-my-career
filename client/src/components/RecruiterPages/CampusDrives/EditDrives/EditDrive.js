import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditDrive.css";

const EditDrive = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqwdin9cy/image/upload";
    const CLOUDINARY_UPLOAD_PRESET = "dj5tzyxw"; 
      const [imageUploading, setImageUploading] = useState(false);

  const [driveData, setDriveData] = useState({
    companyName: "",
    companyImageUrl: "",
    collegeName: "",
    collegeCode: "",
    jobDetails: {
      positionName: "",
      jobType: "",
      ctc: "",
      aboutJob: "",
      responsibilities: "",
    },
    eligibilityCriteria: {
      graduationYear: "",
      minCGPA: "",
      maxBacklogs: "",
    },
    selectionProcess: [],
    applicationDeadline: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing drive details
  useEffect(() => {
    const fetchDrive = async () => {
      try {
        const response = await fetch(`/campus-api/getdrive/${driveId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch drive details");
        }
        const data = await response.json();
        setDriveData(data.drive);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDrive();
  }, [driveId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setDriveData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle nested object changes
  const handleNestedChange = (e, section, key) => {
    const { value } = e.target;
    setDriveData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: value,
      },
    }));
  };

  // Handle selection process changes (array)
  const handleSelectionProcessChange = (e) => {
    setDriveData((prevState) => ({
      ...prevState,
      selectionProcess: e.target.value.split(","),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      
      const data = await response.json();
      setDriveData((prevState) => ({ ...prevState, companyImageUrl: data.secure_url }));
    } catch (error) {
      alert("Image upload failed: " + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/campus-api/editdrive/${driveId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driveData),
      });

      if (!response.ok) {
        throw new Error("Failed to update drive details");
      }

      alert("Drive details updated successfully!");
      navigate(`/recruiter/campusdrives/${driveId}`); // Redirect to Drive Details
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="edit-drive-container">
      <h2>Edit Drive Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Company Name & Logo */}
        <label>Company Name</label>
        <input type="text" name="companyName" value={driveData.companyName} onChange={handleChange} required />

        <label>Company Logo</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUploading && <p>Uploading image...</p>}
        {driveData.companyImageUrl && <img src={driveData.companyImageUrl} alt="Company Logo" style={{ width: "100px", marginTop: "10px" }} />}

        {/* College Info */}
        <label>College Name</label>
        <input type="text" name="collegeName" value={driveData.collegeName} onChange={handleChange} required />

        <label>College Code</label>
        <input type="text" name="collegeCode" value={driveData.collegeCode} onChange={handleChange} required />

        {/* Job Details */}
        <h3>Job Details</h3>
        <label>Position Name</label>
        <input type="text" value={driveData.jobDetails.positionName} onChange={(e) => handleNestedChange(e, "jobDetails", "positionName")} />

        <label>Job Type</label>
        <input type="text" value={driveData.jobDetails.jobType} onChange={(e) => handleNestedChange(e, "jobDetails", "jobType")} />

        <label>CTC</label>
        <input type="text" value={driveData.jobDetails.ctc} onChange={(e) => handleNestedChange(e, "jobDetails", "ctc")} />

        <label>Job Description</label>
        <textarea value={driveData.jobDetails.aboutJob} onChange={(e) => handleNestedChange(e, "jobDetails", "aboutJob")}></textarea>

        <label>Responsibilities</label>
        <textarea value={driveData.jobDetails.responsibilities} onChange={(e) => handleNestedChange(e, "jobDetails", "responsibilities")}></textarea>

        {/* Eligibility Criteria */}
        <h3>Eligibility Criteria</h3>
        <label>Graduation Year</label>
        <input type="text" value={driveData.eligibilityCriteria.graduationYear} onChange={(e) => handleNestedChange(e, "eligibilityCriteria", "graduationYear")} />

        <label>Minimum CGPA</label>
        <input type="text" value={driveData.eligibilityCriteria.minCGPA} onChange={(e) => handleNestedChange(e, "eligibilityCriteria", "minCGPA")} />

        <label>Max Backlogs</label>
        <input type="text" value={driveData.eligibilityCriteria.maxBacklogs} onChange={(e) => handleNestedChange(e, "eligibilityCriteria", "maxBacklogs")} />

        {/* Selection Process */}
        <h3>Selection Process</h3>
        <label>Selection Process (comma-separated)</label>
        <input type="text" value={driveData.selectionProcess.join(", ")} onChange={handleSelectionProcessChange} />

        {/* Application Deadline */}
        <label>Application Deadline</label>
        <input type="date" name="applicationDeadline" value={driveData.applicationDeadline} onChange={handleChange} required />

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditDrive;
