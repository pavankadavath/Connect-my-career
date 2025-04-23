import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css"; // Importing styles
import Navbar from "../Navbar";

const DEFAULT_IMAGE = "https://via.placeholder.com/150"; // Default image URL

const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    companyName: "",
    companyImageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Ensure localStorage has recruiterInfo
  const recruiterInfo = localStorage.getItem("recruiterInfo");
  const recruiterId = recruiterInfo ? JSON.parse(recruiterInfo)?.recruiterId : null;

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      if (!recruiterId) {
        console.error("Recruiter ID is missing.");
        return;
      }

      setLoading(true);

      try {
        const response = await axios.get(`/recruiter-api/getdetails/${recruiterId}`);
        // console.log(response);

        if (response.data) {
          setUserData({
            username: response.data.username || "",
            email: response.data.email || "",
            companyName: response.data.companyName || "",
            companyImageUrl: response.data.companyImageUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching recruiter details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterDetails();
  }, [recruiterId]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.put("/recruiter-api/updateprofile", userData);
      setMessage(response.data.message || "Profile updated successfully.");
      // console.log('DOne')
    } catch (error) {
      setMessage("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-user-details-page">
      <Navbar />
      <div className="edit-user-details-container">
        <h2 className="edit-user-details-title">Update Profile</h2>
        {message && <p className="message">{message}</p>}
        {loading && <p>Loading...</p>}

        {!loading && (
          <form className="edit-user-details-form" onSubmit={handleSubmit}>
            <label className="edit-user-details-label">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="edit-user-details-input"
              required
            />

            <label className="edit-user-details-label">Email</label>
            <input
              type="email"
              name="email"
              value={userData.email}
              className="edit-user-details-input"
              disabled
            />

            <label className="edit-user-details-label">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={userData.companyName}
              onChange={handleChange}
              className="edit-user-details-input"
              required
            />

            <label className="edit-user-details-label">Company Logo</label>
            <div className="company-logo-container">
              <img
                src={userData.companyImageUrl || DEFAULT_IMAGE}
                alt="Company Logo"
                className="company-logo"
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
              />
            </div>

            <label className="edit-user-details-label">Company Logo URL</label>
            <input
              type="text"
              name="companyImageUrl"
              value={userData.companyImageUrl}
              onChange={handleChange}
              className="edit-user-details-input"
            />

            <button type="submit" className="edit-user-details-button" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
