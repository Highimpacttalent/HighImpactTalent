import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../utils";
import { Widget } from "@uploadcare/react-widget";
import { useSelector } from "react-redux";

const ScreeningQuestions = () => {
  const { state } = useLocation();
  console.log(state)
  const navigate = useNavigate();
  const widgetApi = useRef();

  const [applied, setApplied] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [applyButton, setApplyButton] = useState(false);
  const [formData, setFormData] = useState({
    answers: state?.questions ? Array(state.questions.length).fill("") : [],
  });

  const { user } = useSelector((state) => state.user);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = value;
    setFormData({ ...formData, answers: newAnswers });
  };

  const applyHandler = async () => {
    if (!applied) {
      try {
        const res = await apiRequest({
          url: "https://highimpacttalent.onrender.com/api-v1/application/create",
          method: "POST",
          data: {
            job: state?.jobid,
            company: state?.companyid,
            applicant: state?.userid,
          },
        });
        if (res) {
          setApplied(true);
          console.log("Successfully applied", res);
        }
      } catch (error) {
        console.error("Error while applying for job:", error);
      }
    } else {
      navigate("/application-tracking");
    }
  };

  const handleUpload = async (fileInfo) => {
    setFileUrl(fileInfo.cdnUrl);

    try {
      const response = await axios.post(
        "https://highimpacttalent.onrender.com/api-v1/user/upload-resume",
        { url: fileInfo.cdnUrl },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setApplyButton(true);
      } else {
        alert("Please login first.");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  const openUploadDialog = () => {
    widgetApi.current.openDialog(null, {
      accept: "application/pdf",
    });
  };

  // Filter out empty questions
  const filteredQuestions = state?.questions?.filter(
    (question) => question.question.trim() !== ""
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white p-6 shadow-lg rounded-lg">
        {filteredQuestions?.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Screening Questions</h2>
            {filteredQuestions.map((question, index) => (
              <div key={index} className="mb-4">
                <label className="block font-medium text-gray-700">
                  Question {index + 1}: {question.question}
                </label>
                <input
                  type="text"
                  className="mt-2 p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={formData.answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-600 font-medium">
            No screening question provided by company.
          </div>
        )}

        {/* Upload Resume Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Upload Your Resume</h2>
          <button
            onClick={openUploadDialog}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Upload PDF Resume
          </button>
          <Widget
            publicKey="886857a9a1571edf40e9"
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
                className="text-blue-500 hover:underline"
              >
                View Uploaded Resume
              </a>
            </div>
          )}
        </div>

        {/* Apply Button */}
        {applyButton ? (
          <button
            onClick={applyHandler}
            className={`w-full py-2 text-white font-bold rounded-lg transition duration-200 ${
              applied
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {applied ? "View Application Status" : "Apply Now"}
          </button>
        ) : (
          <button
            onClick={() => alert("Upload Your Resume First")}
            className="w-full py-2 bg-gray-400 text-white font-bold rounded-lg cursor-not-allowed"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default ScreeningQuestions;
