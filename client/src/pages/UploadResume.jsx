import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const UploadResume = () => {
  const { user } = useSelector((state) => state.user);
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }
  
    setIsUploading(true);
    setError(null);
  
    try {
      const formData = new FormData();
      formData.append("resume", file);
      
      // The middleware will add the user info from the token
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setFileUrl(response.data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-container bg-white shadow rounded h-[calc(100vh-150px)] flex items-center justify-center">
      <div>
        <h2 className="text-lg font-bold mb-4">Upload Your Resume</h2>
        <button
          onClick={openFileDialog}
          disabled={isUploading}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isUploading ? "Uploading..." : "Upload PDF Resume"}
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          style={{ display: "none" }}
        />

        {error && (
          <div className="mt-4 text-red-500">
            {error}
          </div>
        )}

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
  );
};

export default UploadResume;