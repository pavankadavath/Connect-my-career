import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../UserNavbar";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "./index.css";

function EditUserDetails() {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: { isStudent: false },
  });

  const navigate = useNavigate();
  // const [fileUrl, setFileUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [filee, setFile] = useState(null);

  const isStudent = watch("isStudent");
  
  /** Handle image upload to Cloudinary */

  const  postDetails= async (file)=> {
    setPicLoading(true)
    setIsSaving(true)
    // const cloud_name = "dy8oqvlyy";  // Replace with your Cloudinary Cloud Name
    // const UPLOAD_PRESET = "connectMyCareerkmit";  // Replace with your Upload Preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "connectMyCareerkmit"); 
    formData.append("cloud_name","dy8oqvlyy")
    try {
      
        const response = await fetch(`https://api.cloudinary.com/v1_1/dy8oqvlyy/image/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed!");
        }

        const data = await response.json();
        // console.log("Uploaded Image URL:", data.url);
        setFile(data.url)
        setPicLoading(false);
        setIsSaving(false)
        return data.url; // Returns the uploaded image URL
    } catch (error) {
        console.error("Error uploading image:", error);
        setPicLoading(false);
        setIsSaving(false)
        return null;
    }
}

  /** Handle form submission */
  const handleFormSubmit = async (data) => {
    setIsSaving(true);

    const updateDetails = {
      username: data.username,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: data.address,
      skills: data.skills,
      isStudent: data.isStudent,
      resumeUrl: filee || data.resumeUrl,
      ...(isStudent
        ? {
            studentDetails: {
              admissionNumber: data.admissionNumber,
              collegeCode: data.collegeCode,
              collegeName: data.collegeName,
              branch: data.branch,
              graduationYear: data.graduationYear,
            },
          }
        : { educationDetails: data.educationDetails }),
    };

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?.userId;
      const response = await fetch(`/user-api/updateProfile/${userId}`, {
        method: "PUT",
        body: JSON.stringify(updateDetails),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Update failed");

      toast.success("Details updated successfully!");
      // console.log("response",updateDetails)
      navigate("/user/home");
      reset();
    } catch {
      toast.error("Failed to update details.");
    } finally {
      setIsSaving(false);
    }
  };

  /** Fetch user details on component mount */
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const response = await fetch(`/user-api/user-details/${userInfo?.userId}`);
        const { user } = await response.json();

        if (user) {
          setValue("username", user.username);
          setValue("email", user.email);
          setValue("phoneNumber", user.phoneNumber);
          setValue("address", user.address);
          setValue("skills", user.skills);
          setValue("isStudent", user.isStudent);
          setValue("resumeUrl", user.resumeUrl);

          if (user.isStudent) {
            setValue("admissionNumber", user.studentDetails?.admissionNumber);
            setValue("collegeCode", user.studentDetails?.collegeCode);
            setValue("collegeName", user.studentDetails?.collegeName);
            setValue("branch", user.studentDetails?.branch);
            setValue("graduationYear", user.studentDetails?.graduationYear);
          } else {
            setValue("educationDetails", user.educationDetails || "");
          }
        }
      } catch {
        toast.error("Error fetching user details.");
      }
    };

    fetchUserDetails();
  }, [setValue]);

  return (
    <div className="edit-user-details-page">
      <UserNavbar />
      <div className="edit-user-details-container">
        <form className="edit-user-details-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <label>Username: <input type="text" {...register("username", { required: true })} /></label>
          <label>Email: <input type="email" {...register("email", { required: true })} /></label>
          <label>Phone Number: <input type="tel" {...register("phoneNumber")} /></label>
          <label>Address: <input {...register("address")} /></label>
          <label>Skills: <input type="text" {...register("skills")} /></label>

          {/* Stylish Checkbox */}
          <div className="student-toggle">
            <label>Are you a student?</label>
            <label className="switch">
              <input type="checkbox" {...register("isStudent")} />
              <span className="slider round"></span>
            </label>
          </div>

          {isStudent && (
            <div className="student-fields">
              <label>Admission Number: <input {...register("admissionNumber", { required: isStudent })} /></label>
              <label>College Code: <input {...register("collegeCode", { required: isStudent })} /></label>
              <label>College Name: <input {...register("collegeName", { required: isStudent })} /></label>
              <label>Branch: <input {...register("branch")} /></label>
              <label>Graduation Year: <input type="number" {...register("graduationYear", { required: isStudent })} /></label>
            </div>
          )}

            <label>Education Details: <input type="text" {...register("educationDetails")} /></label>

          {/* Image Upload */}
          <label className="edit-user-details-label">
            Resume (Image):
            {filee ? (
              <a href={filee} target="_blank" rel="noopener noreferrer">
                <img
                  src={filee}
                  alt="Uploaded resume"
                  style={{ maxWidth: "300px", maxHeight: "300px", cursor: "pointer" }}
                />
              </a>
            ) : (
              watch("resumeUrl") && (
                <a href={watch("resumeUrl")} target="_blank" rel="noopener noreferrer">
                  <img
                    src={watch("resumeUrl")}
                    alt="Existing resume"
                    style={{ maxWidth: "300px", maxHeight: "300px", cursor: "pointer" }}
                  />
                </a>
              )
            )}
            <input
              className="edit-user-details-input"
              type="file"
              onChange={(e) => {
                postDetails(e.target.files[0]);
              }}
            />
          </label>


          {picLoading && <p>Uploading your resume, please wait...</p>}

          <button type="submit" disabled={picLoading || isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserDetails;
