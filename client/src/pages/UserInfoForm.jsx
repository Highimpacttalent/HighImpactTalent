import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import { Widget } from "@uploadcare/react-widget";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Loading } from "../components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserInfoForm = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const widgetApi = useRef();
  const profileWidgetApi = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [formData, setFormData] = useState({
    job: "",
    company: "",
    experience: "",
    about: "",
    salary: "",
    contactNumber: "",
    location: "",
    relocate: "no",
    joinConsulting: "",
    dateOfBirth: "",
    profilePic: null,
    resume: null,
  });
  
  const handlePhoneNumberChange = (inputValue) => {
    if (inputValue && inputValue.length <= 13) {
      setValue(inputValue);
    } 
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === "job" && value !== "Other" && { company: value }),
    });
  };
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (e) => {
   e.preventDefault();
    formData.experience = Number(formData.experience);
    formData.contactNumber = value;
    console.log(formData);
    formData.profilePic = profilePic;
    setLoading(true);
    if (fileUrl != "") formData.resume = fileUrl;
    try {
      const res = await apiRequest({
        url: "user/update-user",
        method: "PUT",
        data: formData,
        token: user?.token,
      });
      console.log(res);
      if (res.sucess) {
        alert("successfully user updated");
        navigate("/find-jobs");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      Object.values(formData).every((val) => val !== "" && val !== null) &&
      resumeUploaded &&
      profilePicUploaded
    );
  };

  const handleUpload = async (fileInfo) => {
    if (fileInfo && fileInfo.name) {
      // Safely check if fileInfo.name exists
      const fileExtension = fileInfo.name.split('.').pop().toLowerCase();
      const validExtensions = ["pdf", "doc", "docx"];
  
      if (validExtensions.includes(fileExtension)) {
        setFileUrl(fileInfo.cdnUrl); // Set the file URL for display or storage
        const data = {
          url: fileInfo.cdnUrl,
        };
        try {
          const updateResume = await axios.post(
            "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
            data,
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
                "Content-Type": "application/json",
              },
            }
          );
          console.log(fileInfo, updateResume);
        } catch (error) {
          console.error("Error uploading resume:", error);
        }
      } else {
        alert("Only PDF, DOC, and DOCX files are allowed.");
        // Remove the invalid file from the widget
        if (widgetApi.current) {
          widgetApi.current.removeFile(fileInfo.uuid);
        }
      }
    } else {
      console.error("fileInfo or fileInfo.name is undefined");
    }
  };
  
  const openUploadDialog = () => {
    try {
      if (!widgetApi.current) {
        throw new Error("widgetApi is not initialized or is null.");
      }
  
      widgetApi.current.openDialog(null, {
        accept: ".pdf,.doc,.docx", // Allow PDF, DOC, DOCX only
      });
    } catch (error) {
      console.error("Error opening upload dialog:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // Preview for local file
    }
  };

  const handleUploadCareChange = (file) => {
    if (file) {
      console.log(file);
      setProfilePic(file.cdnUrl); // Store uploaded image URL
    }
  };
  
  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <div className="flex justify-center py-8 px-4 bg-gray-100">
  <form onSubmit={handleSubmit} className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg">
    <div className="grid md:grid-cols-2 gap-6">
      {/* Left Column */}
      <div>
      <div className="mb-6">
  <label className="block text-gray-700 text-sm font-semibold mb-2">
    Last/Current Consulting Company
  </label>
  <select
    name="job"
    value={formData.job}
    onChange={handleChange}
    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Select your Company</option>
    <option value="McKinsey & Company">McKinsey & Company</option>
    <option value="Boston Consulting Group">Boston Consulting Group</option>
    <option value="Bain & Company">Bain & Company</option>
    <option value="Deloitte">Deloitte</option>
    <option value="Accenture">Accenture</option>
    <option value="Kearney">Kearney</option>
    <option value="EY">EY</option>
    <option value="PwC">PwC</option>
    <option value="KPMG">KPMG</option>
    <option value="TSMG">TSMG</option>
    <option value="Strategy&">Strategy&</option>
    <option value="Oliver Wyman">Oliver Wyman</option>
    <option value="IBM">IBM</option>
    <option value="Capgemini E.L.I.T.E.">Capgemini E.L.I.T.E.</option>
    <option value="ZS Associates">ZS Associates</option>
    <option value="Roland Berger">Roland Berger</option>
    <option value="Alvarez & Marsal">Alvarez & Marsal</option>
    <option value="Parthenon Group">Parthenon Group</option>
    <option value="Siemens Management Consulting">Siemens Management Consulting</option>
    <option value="Arthur D. Little">Arthur D. Little</option>
    <option value="Other">Other</option>
  </select>
</div>

{formData.job === "Other" && (
  <div className="mb-6">
    <label className="block text-gray-700 text-sm font-semibold mb-2">Other Company Name</label>
    <input
      type="text"
      name="company"
      value={formData.company}
      onChange={handleChange}
      placeholder="Please Specify Company name...."
      className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>
)}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Current Salary (INR Lakhs)</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="Enter salary"
            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Experience</label>
          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select experience</option>
            {Array.from({ length: 15 }, (_, i) => (
              <option key={i + 1} value={i + 1}>{`${i + 1}+`}</option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Current Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter current location"
            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">About/Summary</label>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Write about your experience"
            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-28"
            required
          ></textarea>
        </div>
      </div>

      {/* Right Column */}
      <div>
       <div className="mb-6">
  <label className="block text-gray-700 text-sm font-semibold mb-2">
    Date of Birth
  </label>
  <input
    type="date"
    name="dateOfBirth"
    value={formData.dateOfBirth}
    onChange={handleChange}
    max={new Date().toISOString().split("T")[0]} // Restrict future dates
    className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
</div>

        <div className="mb-6">
      <label className="block text-gray-700 text-sm font-semibold mb-2">Contact Number</label>
      <div className="border rounded-lg px-3 py-3">
      <PhoneInput
        placeholder="Enter phone number"
        defaultCountry="IN"
        value={value} 
        onChange={handlePhoneNumberChange} 
        maxLength={11}
      />
      </div>
    </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">When did you first join Consulting?</label>
          <select
            name="joinConsulting"
            value={formData.joinConsulting}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select consulting type</option>
            <option value="Lateral">Lateral</option>
            <option value="Out of campus">Out of campus</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Open to Relocation?</label>
          <div className="flex items-center">
            <input
              type="radio"
              name="relocate"
              value="yes"
              checked={formData.relocate === "yes"}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <span className="mr-4">Yes</span>
            <input
              type="radio"
              name="relocate"
              value="no"
              checked={formData.relocate === "no"}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <span>No</span>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Upload Profile Picture</label>
          <button className="bg-blue-500 rounded-lg cursor-pointer">
            <Widget
              publicKey="8eeb05a138df98a3c92f"
              ref={profileWidgetApi}
              onChange={handleUploadCareChange}
              imagesOnly
              clearable
              tabs="file"
            />
          </button>
          {profilePic && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={profilePic}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover mt-2"
              />
            </div>
          )}
        </div>
        <div className="mb-6">
          <h2 className="text-sm font-semibold">Upload Your Resume</h2>
          <button
            onClick={openUploadDialog}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-600"
          >
            Upload PDF Resume
          </button>
          <Widget
            publicKey="8eeb05a138df98a3c92f"
            ref={widgetApi}
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          {fileUrl && (
            <div className="mt-4">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                View Your Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="mt-6">
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white py-3 px-6 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </div>
  </form>
</div>

  );
};

export default UserInfoForm;