import React, { useState, useEffect } from "react";
import UserNavbar from "../UserNavbar";
import { toast } from "react-toastify";
import "./UserCampusDrives.css";
import UserCampusJobCard from "./CampusJobCard/UserCampusJobCard";
import AppliedCampusDrives from "./AppliedDrives/AppliedCampusDrives";

const UserCampusDrives = () => {
  const [campusDrives, setCampusDrives] = useState([]);
  const [appliedDrives, setAppliedDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (!userInfo || !userInfo.userId) {
      console.error("User information not found in localStorage");
      return;
    }

    setUserData(userInfo);
    fetchCampusDrives(userInfo);
  }, []);
  
  const handleWithdraw = (driveId) => {
    setAppliedDrives((prevDrives) => prevDrives.filter((drive) => drive._id !== driveId));
  };
  
  const fetchCampusDrives = async (userInfo) => {
    try {
      const { userId, userType, studentDetails } = userInfo;
      if (userType !== "Student" || !studentDetails) return;

      const { collegeCode } = studentDetails;
      const url = `/campus-api/campus-drives?collegeCode=${collegeCode}&studentId=${userId}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch campus drives");

      const data = await response.json();

      setCampusDrives(data.drives || []);
      setAppliedDrives(data.appliedDrives || []);
    } catch (error) {
      console.error("Error fetching campus drives:", error);
      toast.error("Failed to fetch campus drives", {
        position: "top-center",
        autoClose: 2000,
      });
      setCampusDrives([]);
      setAppliedDrives([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="drives-container">
        <UserNavbar />
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading drives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="drives-container">
      <UserNavbar />
      <div className="drives-content">
        <div className="drives-grid">
          {/* Latest Drives Section */}
          <div className="drives-section">
            <h2>Latest Campus Drives</h2>
            <div className="drives-list">
              {campusDrives.length === 0 ? (
                <p className="no-drives">No campus drives found from your college.</p>
              ) : (
                campusDrives.map((drive, index) => (
                  <UserCampusJobCard key={index} drive={drive} userData={userData} setAppliedDrives={setAppliedDrives}/>
                ))
              )}
            </div>
          </div>

          {/* Applied Drives Section */}
          <div className="drives-section">
            <h2>My Applied Drives</h2>
            <div className="drives-list">
              {appliedDrives.length === 0 ? (
                <p className="no-drives">No applied campus drives found.</p>
              ) : (
                appliedDrives.map((drive, index) => (
                  <AppliedCampusDrives key={index} drive={drive} onWithdraw={handleWithdraw} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCampusDrives;
