import React, { useRef, useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import { useSelector } from "react-redux";
import axios from "axios";

const ResumeUpload = () => {
  const { user } = useSelector((state) => state.user);
  const widgetApi = useRef();
  const [fileUrl, setFileUrl] = useState("");

  const handleUpload =async (fileInfo) => {
    console.log("File uploaded:", fileInfo);
    // Send the fileInfo.cdnUrl to your backend to save it in the database
    setFileUrl(fileInfo.cdnUrl);
          const data ={
        url:fileInfo.cdnUrl
      }
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
      console.log(fileInfo,updateResume);
  };

  const openUploadDialog = () => {
    widgetApi.current.openDialog(null, {
      accept: "application/pdf", // Only accept PDF files
    });
  };

  return (
    <div className="upload-container bg-white shadow rounded h-[calc(100vh-150px)] flex items-center justify-center ">
      <div>
      <h2 className="text-lg font-bold mb-4">Upload Your Resume</h2>
      <button
        onClick={openUploadDialog}
        className="bg-blue-500  text-white font-bold py-2 px-4 rounded"
      >
        Upload PDF Resume
      </button>
      <Widget
        publicKey="8eeb05a138df98a3c92f"
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
    </div>
  );
};

export default ResumeUpload;
