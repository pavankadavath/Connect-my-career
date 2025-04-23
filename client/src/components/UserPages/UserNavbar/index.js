import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/cmc_logo.png";
import "./index.css";

function UserNavbar(){
    const [menuOpen,setMenuOpen]=useState(false);
    const [isStudent,setIsStudent]=useState(true);
    const navigate=useNavigate();

    const onClickLogOut=()=>{
        Cookies.remove("user_jwt_token");
        localStorage.removeItem("userInfo");
        navigate("/",{replace:true});
        setIsStudent(false);
    }
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
            if (!userInfo || !userInfo.userId) {
              console.error("User information not found in localStorage");
              return;
            }
    
            if (userInfo.userType === "Student" && userInfo.studentDetails) {
              setIsStudent(true)
            }
    
          } finally {
            // console.log(isStudent)
          }
        };
    
        fetchUser();
      }, []);
    return (
        <div className="user-nav-bar-container">
            <div className="desktop-nav">
                <div className="company-logo-container">
                    {/* <Link to={"/user/home"}><img alt="navbar-company-logo" src={Logo}  className="navbar-company-logo"/></Link> */}
                    <Link to={"/user/home"}><img alt="navbar-company-logo" src={Logo}  className="navbar-company-logo"/></Link>
                </div>
                <div className="user-options-container">
                    <div className="large-screen-options">
                        <ul className="options-container">
                            <Link to={"/user/alljobs"}><li className="option">AllJobs</li></Link>
                            <Link to={"/user/appliedjobs"}><li className="option">Applied</li></Link>
                            {isStudent &&
                                <Link to={"/user/campusdrives"}><li className="option">Campus</li></Link>
                            }
                            <Link to={"/user/updateUserProfile"}><li className="option">Profile</li></Link>
                        </ul>
                        <button type="button" className="logout-button" onClick={onClickLogOut}>Logout</button>
                    </div>
                    <div className="mobile-hamburger-icon-container">
                        <button className="hamburger-icon-mobile" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen ? <IoIosCloseCircleOutline />:<GiHamburgerMenu />}</button>
                    </div>
                </div>
            </div>
            {menuOpen && <div className="mobile-options">
                <ul className="options-container">
                    <Link to={"/user/alljobs"}><li className="option">AllJobs</li></Link>
                    <Link to={"/user/appliedjobs"}><li className="option">Applied</li></Link>
                    {isStudent &&
                        <Link to={"/user/campusdrives"}><li className="option">Campus</li></Link>
                    }
                    <Link to={"/user/updateUserProfile"}><li className="option">updateProfile</li></Link>
                </ul>
                <button type="button" className="logout-button" onClick={onClickLogOut}>Logout</button>
            </div>}
        </div>
    )
}

export default UserNavbar;