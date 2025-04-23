import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import "./ConductDrives.css"
function ConductDrives() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [campusDrives, setCampusDrives] = useState([]);
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dqwdin9cy/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "dj5tzyxw"; 
  const [imageUploading, setImageUploading] = useState(false);
  const [companyImageUrl, setCompanyImageUrl] = useState("");

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
      setCompanyImageUrl(data.secure_url);
    } catch (error) {
      alert("Image upload failed: " + error.message);
    } finally {
      setImageUploading(false);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      const recruiter = JSON.parse(localStorage.getItem('recruiterInfo'));
      const url = `http://localhost:5000/campus-api/postdrive`;

      // console.log(data)
      // Prepare the payload data
      const payload = {
        recruiterId: recruiter.recruiterId,
        collegeCode: data.collegeCode,
        collegeName: data.collegeName,
        companyName: data.companyName,
        companyImageUrl:companyImageUrl,
        applicationDeadline: data.applicationDeadline,
        jobDetails: {
          positionName: data.jobDetails.positionName,
          jobType: data.jobDetails.jobType,
          ctc: data.jobDetails.ctc,
          aboutJob: data.jobDetails.aboutJob,
          qualifications: data.jobDetails.qualifications,
          responsibilities: data.jobDetails.responsibilities,
        },
        selectionProcess: data.selectionProcess,
        status: "Upcoming", // Assuming the status is upcoming for now
      };

      // console.log(payload)
      // Making the POST request to the server
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to post drive');

      const newDrive = await response.json();
      setCampusDrives((prevDrives) => [...prevDrives, newDrive]); 

      // console.log(`User data for drive ${campusDrives}`)

      toast.success('Campus drive posted successfully!', {
        position: 'top-center',
        autoClose: 2000,
      });

      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Error posting campus drive:', error);
      toast.error('Failed to post campus drive', {
        position: 'top-center',
        autoClose: 2000,
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          {/* College Code */}
          <div className="form-group">
            <label htmlFor="collegeCode">College Code</label>
            <input
              type="text"
              id="collegeCode"
              {...register('collegeCode', { required: 'College Code is required' })}
              placeholder="Enter the College code"
            />
            {errors.collegeCode && <span className="error">{errors.collegeCode.message}</span>}
          </div>

          {/* College Name */}
          <div className="form-group">
            <label htmlFor="collegeName">College Name</label>
            <input
              type="text"
              id="collegeName"
              {...register('collegeName', { required: 'College Name is required' })}
              placeholder="Enter the college name"
            />
            {errors.collegeName && <span className="error">{errors.collegeName.message}</span>}
          </div>
        </div>

        {/* Company Name */}
        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input
            type="text"
            id="companyName"
            {...register('companyName', { required: 'Company Name is required' })}
            placeholder="Enter the Company name"
          />
          {errors.companyName && <span className="error">{errors.companyName.message}</span>}
        </div>

        
        <label>Company Logo</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imageUploading && <p>Uploading image...</p>}
        {campusDrives.companyImageUrl && <img src={campusDrives.companyImageUrl} alt="Company Logo" style={{ width: "100px", marginTop: "10px" }} />}


        {/* Application Deadline */}
        <div className="form-group">
          <label htmlFor="applicationDeadline">Application Deadline</label>
          <input
            type="date"
            id="applicationDeadline"
            {...register('applicationDeadline', { required: 'Application Deadline is required' })}
          />
          {errors.applicationDeadline && <span className="error">{errors.applicationDeadline.message}</span>}
        </div>

        <fieldset className="form-group">
          <legend>Job Details</legend>
          {/* Position Name */}
          <div className="form-subgroup">
            <label htmlFor="positionName">Position Name</label>
            <input
              type="text"
              id="positionName"
              {...register('jobDetails.positionName', { required: '*Position Name is required' })}
              placeholder="Eg: Software Engineer II"
            />
            {errors.jobDetails?.positionName && (
              <span className="error">{errors.jobDetails.positionName.message}</span>
            )}
          </div>

          {/* Job Type */}
          <div className="form-subgroup">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              {...register('jobDetails.jobType', { required: '*Job Type is required' })}
            >
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
            </select>
            {errors.jobDetails?.jobType && (
              <span className="error">{errors.jobDetails.jobType.message}</span>
            )}
          </div>

          {/* CTC */}
          <div className="form-subgroup">
            <label htmlFor="ctc">CTC $ :</label>
            <input
              type="text"
              id="ctc"
              {...register('jobDetails.ctc', { required: '*CTC is required' })}
              placeholder="Eg: $80,000 - $100,000"
            />
            {errors.jobDetails?.ctc && <span className="error">{errors.jobDetails.ctc.message}</span>}
          </div>

          {/* About the Job */}
          <div className="form-subgroup">
            <label htmlFor="aboutJob">About the Job</label>
            <textarea
              id="aboutJob"
              {...register('jobDetails.aboutJob', { required: '*About the Job is required' })}
              placeholder="Provide a description about the job..."
            ></textarea>
            {errors.jobDetails?.aboutJob && (
              <span className="error">{errors.jobDetails.aboutJob.message}</span>
            )}
          </div>

          {/* Qualifications */}
          <div className="form-subgroup">
            <label htmlFor="Qualifications">Qualifications</label>
            <textarea
              id="Qualifications"
              {...register('jobDetails.qualifications', { required: '*Qualifications are required' })}
              placeholder="List job Qualifications..."
            ></textarea>
            {errors.jobDetails?.qualifications && (
              <span className="error">{errors.jobDetails.qualifications.message}</span>
            )}
          </div>

          {/* Responsibilities */}
          <div className="form-subgroup">
            <label htmlFor="responsibilities">Responsibilities</label>
            <textarea
              id="responsibilities"
              {...register('jobDetails.responsibilities', { required: '*Responsibilities are required' })}
              placeholder="List job responsibilities..."
            ></textarea>
            {errors.jobDetails?.responsibilities && (
              <span className="error">{errors.jobDetails.responsibilities.message}</span>
            )}
          </div>
        </fieldset>

        {/* Selection Process */}
        <div className="form-group">
          <label htmlFor="selectionProcess">Selection Process</label>
          <textarea
            id="selectionProcess"
            {...register('selectionProcess')}
            placeholder="Eg: Online Test, Group Discussion, HR Interview"
          ></textarea>
        </div>

        <button type="submit" className="btn-submit">
          Post Drive
        </button>
      </form>
    </div>
  );
}

export default ConductDrives;
