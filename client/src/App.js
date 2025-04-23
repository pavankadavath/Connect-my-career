import { BrowserRouter,Route,Routes } from "react-router-dom";
import UserLogin from "./components/LoginPage/Login"
import UserRegister from "./components/RegistrationPage"
import UserHome from "./components/UserPages/UserHome"
import PageNotFound from "./components/PageNotFound";

import UserProtectedRoutes from "./components/UserProtectedRoutes"
import RecruiterProtectedRoutes from "./components/RecruiterProtectedRoutes"
import RecruiterHome from "./components/RecruiterPages/Home/RecruiterHome";
import MyJobs from "./components/RecruiterPages/MyJobs";
import PostJob from "./components/RecruiterPages/PostJob";
import RecruiterCampusDrives from "./components/RecruiterPages/CampusDrives/RecruiterCampusDrives";
import Applications from "./components/RecruiterPages/Applications";
import UpdateProfile from "./components/RecruiterPages/UpdateProfile/UpdateProfile";

import AllJobs from "./components/UserPages/AllJobs";
import AppliedJobs from "./components/UserPages/AppliedJobs";
import EditUserDetails from "./components/UserPages/EditUserDetails/EditUserDetails";
import UserCampusDrives from "./components/UserPages/UserCampusDrives/UserCampusDrives";
import "react-toastify/dist/ReactToastify.css";
  import {ToastContainer ,Bounce} from 'react-toastify';
import DriveDetails from "./components/RecruiterPages/CampusDrives/DriveDetails/DriveDetails";
import EditDrive from "./components/RecruiterPages/CampusDrives/EditDrives/EditDrive";
import CampusApplications from "./components/RecruiterPages/CampusDrives/CampusApplications/CampusApplications";

function App() {

  return (
    <>
      <BrowserRouter>
      <ToastContainer transition={Bounce}/>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route exact path="/" element={<UserLogin />} />
        <Route exact path="/register" element={<UserRegister />} />
        {/* RECRUITER PROTECTED ROUTES */}
        <Route path="/recruiter/*" element={<RecruiterProtectedRoutes />}>
          <Route exact path="home" element={<RecruiterHome />} />
          <Route exact path="myjobs" element={<MyJobs />} />
          <Route exact path="postjob" element={<PostJob />} />
          <Route exact path="campusdrives" element={<RecruiterCampusDrives/>} />
          <Route exact path="campusdrives/:driveId" element={<DriveDetails />} />
          <Route exact path="campusdrives/edit/:driveId" element={<EditDrive />} />
          <Route exact path="campusdrives/applications/:driveId" element={<CampusApplications/>} />

          <Route exact path="profile" element={<UpdateProfile/>} />

          <Route exact path="applications/:jobId" element={<Applications />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        {/* USER PROTECTED ROUTES */}
        <Route path="/user/*" element={<UserProtectedRoutes />}>
          <Route exact path="home" element={<UserHome />} />
          <Route exact path="alljobs" element={<AllJobs />} />
          <Route exact path="appliedjobs" element={<AppliedJobs />} />
          <Route exact path="updateUserProfile" element={<EditUserDetails />} />
          <Route exact path="campusdrives" element={<UserCampusDrives />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        {/* 404 Page */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      
      </BrowserRouter>  
    </>
  );
}

export default App;
