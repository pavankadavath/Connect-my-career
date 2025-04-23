import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import registrationImage from "../../assets/registrationImage.avif";
import logo from "../../assets/cmc_logo.png";
import "./index.css";
import { FaEye } from "react-icons/fa";
import { IoEyeOffSharp } from "react-icons/io5";

function UserRegister() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const [filee, setFile] = useState(null);
  const [picLoading, setPicLoading] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const onSubmit = async (dat) => {
    if(otpVerified === false) {
      setErrorMsg("Please verify your email with OTP");
      return;
    }

    const user = dat;
    if (user.userType === "JobSeeker") {
      const userData = {
        username: user.username,
        email: user.email,
        password: user.password
      };

      const options = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const userRegisterUrl = "/user-api/register";
      try {
        const response = await fetch(userRegisterUrl, options);
        if (response.status === 200) {
          throw new Error("User with the same email already exists.");
        }

        await response.json();
        toast.success('Registered successfully!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/", { replace: true });
        setErrorMsg("");
      } catch (error) {
        setErrorMsg(error.message);
      }
    } else if (user.userType === "Recruiter") {
      const userData = {
        username: user.username,
        email: user.email,
        password: user.password,
        companyName: user.companyName,
        companyImageUrl: filee
      };
      const options = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const recruiterRegisterUrl = "/recruiter-api/register";
      try {
        const response = await fetch(recruiterRegisterUrl, options);
        if (response.status === 200) {
          throw new Error("Recruiter with the same email already exists");
        }

        await response.json();
        toast.success('Registered successfully!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/", { replace: true });
        setErrorMsg("");
      } catch (error) {
        setErrorMsg(error.message);
      }
    }
  };

  const postImage = async (file) => {
    setPicLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "connectMyCareerkmit");
    formData.append("cloud_name", "dy8oqvlyy");
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dy8oqvlyy/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed!");
      }

      const data = await response.json();
      setFile(data.url);
      setPicLoading(false);
      return data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setPicLoading(false);
      return null;
    }
  };

  const generateOTP = async () => {
    const userData = {
      email: email
    };
    if(email === "" || email === null || email.length === 0) {
      setErrorMsg("Email is required");
      return;
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const otpUrl = "/email-api/generate-otp";
    try {
      const response = await fetch(otpUrl, options);
      const data = await response.json();
      if (response.status === 200 && data.message === "User or Recruiter with the same email already exists") {
        throw new Error(data.message);
      }

      toast.success('OTP sent successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOtpSent(true);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const verifyOTP = async () => {
    const userData = {
      email: email,
      otp: otp
    };
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const otpUrl = "/email-api/verify-otp";
    try {
      const response = await fetch(otpUrl, options);
      const data = await response.json();
      if (response.status === 200 && data.message === "User or Recruiter with the same email already exists") {
        throw new Error(data.message);
      }

      toast.success('OTP verified successfully!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOtpSent(false);
      setOtpVerified(true);
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  const userType = watch("userType");

  return (
    <div className="register-container">
      <div className="user-register-page">
        <div className="user-register-page-image-container">
          <img alt="job" className="register-page-image" src={registrationImage} />
        </div>
        <div className="user-register-page-form-container">
          <form className="user-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="logo-container">
              <img className="website-logo" src={logo} alt="app-logo" />
            </div>

            <div className="user-input-container">
              <label className="user-register-label" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="user-register-element"
                {...register("username", { required: "*Username is required" })}
              />
              {errors.username && <p className="error-message">{errors.username.message}</p>}
            </div>
            {/* email */}
            <div className="user-input-container">
              <label className="user-register-label" htmlFor="email">
                EMAIL
              </label>

              <div className="email-wrapper-container">
              {errorMsg !== "" && <p className="errormessage">{errorMsg}</p>}
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="user-register-element"
                  value={email}
                  {...register("email", { required: "*Email is required" })}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {otpSent && (
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className="user-register-element"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                )}
                <div className="otp-buttons-container">
                  <button type="button" className="generate-otp-btn" onClick={generateOTP} disabled={otpSent}>Get OTP</button>
                  <button type="button" className="verify-otp-btn" onClick={verifyOTP} disabled={!otpSent}>Verify OTP</button>
                </div>
              </div>
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>

            <div className="user-input-container">
              <label className="user-register-label" htmlFor="password">
                PASSWORD
              </label>
              <div className="password-wrapper-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="user-register-element"
                  {...register("password", { required: "*Password is required" })}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <IoEyeOffSharp />}
                </button>
              </div>
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div className="user-input-container">
              <label className="user-register-label" htmlFor="user-type">
                USER-TYPE
              </label>
              <select {...register("userType", {
                required: "*User type is required",
                validate: value => value === "Recruiter" || value === "JobSeeker" || "*Please select a valid user type"
              })} className="types-list-container" defaultValue="DEFAULT">
                <option value="DEFAULT" disabled>
                  Choose an option
                </option>
                <option value="Recruiter">Recruiter</option>
                <option value="JobSeeker">Job Seeker</option>
              </select>
              {errors.userType && <p className="error-message">{errors.userType.message}</p>}
            </div>

            {userType === "Recruiter" && (
              <>
                <div className="user-input-container">
                  <label className="user-register-label" htmlFor="companyName">
                    COMPANY-NAME
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="user-register-element"
                    {...register("companyName", { required: "*Company name is required" })}
                  />
                  {errors.companyName && <p className="error-message">{errors.companyName.message}</p>}
                </div>
                <div className="user-input-container">
                  <label className="user-register-label" htmlFor="companyImageUrl">
                    COMPANY IMAGE
                  </label>
                  <input
                    type="file"
                    id="companyImageUrl"
                    name="companyImageUrl"
                    className="user-register-element"
                    onChange={(e) => postImage(e.target.files[0])}
                  />
                </div>
              </>
            )}

            <div className="register-page-button-container">
              <button type="submit" className="register-button">
                {picLoading ? "image uploading please wait!!" : "Register"}
              </button>
              <p className="already-have-account">
                Already have an account? <Link to={"/"}><span className="got-to-login-link">Login here</span>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserRegister;