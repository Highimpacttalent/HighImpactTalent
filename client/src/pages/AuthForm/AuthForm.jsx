import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils";
import { useDispatch } from "react-redux";
import { Login } from "../../redux/userSlice";
const AuthForm = () => {
  const [isUser, setIsUser] = useState(true);
  const dispatch = useDispatch();
  // State for User Registration Form
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedOption, setSelectedOption] = useState("company");
  // State for Recruiter Registration Form
  const [recruiterForm, setRecruiterForm] = useState({
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const checkPasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };
  // Handle input change for User Form
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") checkPasswordStrength(value);
    setUserForm((prev) => ({ ...prev, [name]: value }));
    if (name === "confirmPassword") {
      checkPasswordMatch(userForm.password, value);
    }
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
  };
  // Handle input change for Recruiter Form
  const handleRecruiterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "password") checkPasswordStrength(value);
    setRecruiterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "confirmPassword") {
      checkPasswordMatch(recruiterForm.password, value);
    }
    if (name === "email") {
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address.");
      } else {
        setEmailError("");
      }
    }
  };
  // Check password strength
  const checkPasswordStrength = (password) => {
    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /[0-9]/.test(password);
    const specialCharCriteria = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (
      lengthCriteria &&
      uppercaseCriteria &&
      lowercaseCriteria &&
      numberCriteria &&
      specialCharCriteria
    ) {
      setPasswordStrength("Strong");
      setPasswordError("");
    } else if (
      lengthCriteria &&
      (uppercaseCriteria || lowercaseCriteria) &&
      numberCriteria
    ) {
      setPasswordStrength("Medium");
      setPasswordError(
        "Password is medium. Consider adding more variety in characters."
      );
    } else {
      setPasswordStrength("Weak");
      setPasswordError(
        "Password is weak. It should include uppercase, lowercase, number, and special character."
      );
    }
  };
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (isUser) {
      // Submit userForm data to your API or handle it
      try {
        const res = await apiRequest({
          url: "user/register",
          method: "POST",
          data: userForm,
        });
        console.log(res);
        if (res.success) {
          const userData = { token: res?.token, ...res?.user };
          dispatch(Login(userData));
          localStorage.setItem("userInfo", JSON.stringify(userData));
          navigate("/user-additional-details");
        }else{
          alert("error while register")
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false)
      }
    } else {
      const newData = { ...recruiterForm, copmanyType: selectedOption };
      setLoading(true)
      try {
        const res = await apiRequest({
          url: "companies/register",
          method: "POST",
          data: newData,
        });
        console.log(res);
        if (res.success) {
          const userData = { token: res?.token, ...res?.user };
          dispatch(Login(userData));
          localStorage.setItem("userInfo", JSON.stringify(userData));
          navigate("/upload-a-job");
        } else {
          console.log(res.message);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-around mb-2 w-full">
          <button
            className={`py-2 w-full px-4  ${
              isUser ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsUser(true)}
          >
            User
          </button>
          <button
            className={`py-2 px-4 w-full  ${
              !isUser ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsUser(false)}
          >
            Recruiter
          </button>
        </div>

        {isUser ? (
          <form onSubmit={handleSubmit}>
            {/* <h2 className="text-lg font-bold mb-3 text-center ">
              User Register
            </h2> */}
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">First Name</label> */}
              <input
                type="text"
                name="firstName"
                placeholder="enter first name"
                value={userForm.firstName}
                onChange={handleUserChange}
                className="w-full p-2 border  capitalize"
                required
              />
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">Last Name</label> */}
              <input
                type="text"
                name="lastName"
                placeholder="enter last name"
                value={userForm.lastName}
                onChange={handleUserChange}
                className="w-full p-2 border  capitalize"
                required
              />
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">Email</label> */}
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={userForm.email}
                onChange={handleUserChange}
                className="w-full p-2 border"
                required
              />
              {/* {emailError!=""?<p className="text-red-500">{emailError}</p>:<></>} */}
              {emailError && (
                <p className="mt-2 text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">Password</label> */}
              <input
                type="password"
                name="password"
                placeholder="enter password"
                value={userForm.password}
                onChange={handleUserChange}
                className="w-full p-2 border  capitalize"
                required
              />
              {passwordError && (
                <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">
                Confirm Password
              </label> */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="enter confirm Password"
                value={userForm.confirmPassword} // or recruiterForm.confirmPassword
                onChange={handleUserChange} // or handleRecruiterChange
                className="w-full p-2 border  capitalize"
              />
              {confirmPasswordError && (
                <p className="mt-2 text-red-500 text-sm">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <button className="w-full bg-blue-500 text-white p-2  mb-2">
              {loading?"Loading...":"Register"}
            </button>
            <div>
              Already have an account ?{" "}
              <Link
                to={"/authlogin"}
                className="text-blue-500 border-b border-blue-500"
              >
                login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* <h2 className="text-lg font-bold mb-3 text-center">
              Recruiter Register
            </h2> */}
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">Email</label> */}
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={recruiterForm.email}
                onChange={handleRecruiterChange}
                className="w-full p-2 border"
                required
              />
              {emailError && (
                <p className="mt-2 text-red-500 text-sm">{emailError}</p>
              )}
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">Company Name</label> */}
              <input
                type="text"
                name="companyName"
                placeholder="enter company Name"
                value={recruiterForm.companyName}
                onChange={handleRecruiterChange}
                className="w-full p-2 border  capitalize"
                required
              />
            </div>
            <div className="w-full">
              <h2 className="text-sm mb-2">Select an Option :</h2>
              <div className="flex gap-4 w-full grid grid-cols-2">
                <div className="flex items-center ">
                  <label className="block text-gray-700 text-sm mb-2 flex items-center">
                    <input
                      type="checkbox"
                      value="company"
                      checked={selectedOption === "company"}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                      }}
                      className="mr-2 leading-tight"
                    />
                    Company
                  </label>
                </div>
                <div className="flex items-center ">
                  <label className="block text-gray-700 text-sm mb-2 flex items-center">
                    <input
                      type="checkbox"
                      value="hiringAgency"
                      checked={selectedOption === "hiringAgency"}
                      onChange={(e) => {
                        setSelectedOption(e.target.value);
                      }}
                      className="mr-2 leading-tight"
                    />
                    Hiring Agency
                  </label>
                </div>
              </div>
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">Password</label> */}
              <input
                type="password"
                name="password"
                placeholder="enter password"
                value={recruiterForm.password}
                onChange={handleRecruiterChange}
                className="w-full p-2 border  capitalize"
                required
              />
              {passwordError && (
                <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
              )}
            </div>
            <div className="mb-4">
              {/* <label className="block text-gray-700 mb-2">
                Confirm Password
              </label> */}
              <input
                type="password"
                name="confirmPassword"
                placeholder="enter confirm Password"
                value={recruiterForm.confirmPassword}
                onChange={handleRecruiterChange}
                className="w-full p-2 border  capitalize"
              />
              {confirmPasswordError && (
                <p className="mt-2 text-red-500 text-sm">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            <button className="w-full bg-blue-500 text-white p-2  mb-2">
              {loading?"Loading...":"Register"}
            </button>

            <div>
              Already have an account ?{" "}
              <Link
                to={"/authlogin"}
                className="text-blue-500 border-b border-blue-500"
              >
                login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
