import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { Widget } from "@uploadcare/react-widget";
import { useSelector } from "react-redux";
// import axios from "axios";

const ScreeningQuestions = () => {
  const { state } = useLocation();
  const [applied,setApplied]=useState(false)
  const [status,setStatus]=useState('applied')
  const [formData, setFormData] = useState({
    answers: ["", ""], // Assuming there are 2 screening questions
  });
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({
      ...formData,
      answers: newAnswers,
    });
  };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//   };

  const applyHandler = async (jobid,companyid,applicantid)=>{
    // alert('clicked')
    // e.preventDefault();
    console.log(jobid,companyid,applicantid)
    // axios
    try {
      const res = await apiRequest({
        url: `https://demojobportal.onrender.com/api-v1/application/create`,
        data:{job:jobid,company:companyid,applicant:applicantid},
        method: "POST",
      });
      if(res){
        setApplied(true)
        console.log('applied',res)
      }
    } catch (error) {
      console.log('Error while apply for job')
      
    }
  }
  ///resume
  const { user } = useSelector((state) => state.user);
  const widgetApi = useRef();
  const [fileUrl, setFileUrl] = useState("");
  const [applyButton,setApplyButton]=useState(false)
  const handleUpload =async (fileInfo) => {
    console.log("File uploaded:", fileInfo);
    // Send the fileInfo.cdnUrl to your backend to save it in the database
    setFileUrl(fileInfo.cdnUrl);
          const data ={
        url:fileInfo.cdnUrl
      }
      const updateResume = await axios.post(
        "https://demojobportal.onrender.com/api-v1/user/upload-resume",
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(fileInfo,updateResume.data.success);
      if(updateResume.data.success){
        setApplyButton(true);
      }else{
        alert('please Login First')
      }
  };

  const openUploadDialog = () => {
    widgetApi.current.openDialog(null, {
      accept: "application/pdf", // Only accept PDF files
    });
  };
  const navigate=useNavigate()
  useEffect(() => {
    console.log(formData)
    console.log(state);
    console.log(state.questions.length)
  });
  return (
    <div className="h-screen">
        {/* onSubmit={handleSubmit} */}
        <div >
      {state.questions.length>0&&<div><div>
        <label>
          <div><span>Question 1:</span><span>{state?.questions?.[0]}</span></div>
          <input
            type="text"
            className="p-2 bg-zinc-200 w-full rounded-lg"
            value={formData.answers[0]}
            onChange={(e) => handleAnswerChange(0, e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
        <div><span>Question 2:</span><span>{state?.questions?.[1]}</span></div>
          <input
            type="text"
            className="p-2 bg-zinc-200 w-full rounded-lg"
            value={formData.answers[1]}
            onChange={(e) => handleAnswerChange(1, e.target.value)}
            required
          />
        </label>
      </div></div>}
      <div>
      <h2 className="text-lg font-bold mb-4">Upload Your Resume</h2>
      <button
        onClick={openUploadDialog}
        className="bg-blue-500  text-white font-bold py-2 px-4 rounded"
      >
        Upload PDF Resume
      </button>
      <Widget
        publicKey="886857a9a1571edf40e9"
        ref={widgetApi}
        onChange={handleUpload}
        style={{ display: "none" }} // Hide the default widget
      />
      {fileUrl && (
        <div className="mt-4">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            See Your Resume
          </a>
        </div>
      )}
      </div>
      {/* <div onClick={()=>{
        navigate('/upload-resume')
      }} className="capitalize my-3 p-2 bg-blue-500 text-white rounded-lg text-center">Upload Resume</div> */}
      {applyButton?<div
      onClick={()=>{
          !applied&&applyHandler(state.jobid,state.companyid,state.userid)
          applied&&navigate('/application-tracking')
        }} 
      className={`py-2 px-4 flex bg-blue-500 w-full text-white items-center justify-center text-black rounded-[10px] my-3 capitalize`}
    > 
      {applied?`view application status`:'apply now'}
        </div>:<div onClick={()=>{
            alert('Upload Your Resume First')
        }} className="capitalize py-2 px-4 flex bg-blue-500/40 w-full text-white items-center justify-center text-black rounded-[10px] my-3">Apply</div>}
    </div>
    </div>
  );
};

export default ScreeningQuestions;
