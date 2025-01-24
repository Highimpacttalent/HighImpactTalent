import React, { useState } from "react";
import { apiRequest } from "../utils";
import { useSelector } from "react-redux";

const JobUploadPage = () => {
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    experience: "",
    salary: "",
    salaryCategory:"",
    salaryConfidential: false,
    jobLocation: "",
    jobDescription: "",
    requirements: [""],
    qualifications: [""],
    screeningQuestions: [{ question: "", mandatory: false }],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (index, e) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[name]];
    updatedArray[index] = value;
    setFormData({ ...formData, [name]: updatedArray });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, ""],
    });
  };

  const addScreeningQuestion = () => {
    setFormData({
      ...formData,
      screeningQuestions: [
        ...formData.screeningQuestions,
        { question: "", mandatory: false },
      ],
    });
  };

  const handleScreeningQuestionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedQuestions = [...formData.screeningQuestions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData({ ...formData, screeningQuestions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.experience = Number(formData.experience);
    formData.salary = Number(formData.salary);
    console.log(formData);
    // Handle form submission logic here
    setIsLoading(true);
    // setErrMsg(null);
    try {
      const res = await apiRequest({
        url: "/jobs/upload-job",
        token: user?.token,
        data: formData,
        method: "POST",
      });
      if (res.status == "failed") {
        console.log("failed");
        // setErrMsg({ ...res });
      } else {
        // setErrMsg("success");
        console.log("success", res);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded"
    >
      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">Job Title</label>
        <input
          type="text"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Years of Experience
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select experience</option>
          {Array.from({ length: 15 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{`${i + 1}+`}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Annual Salary (INR Lakh)
        </label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        {/* <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="salaryConfidential"
            checked={formData.salaryConfidential}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label className="text-gray-700 text-sm ">
            Keep Salary Confidential
          </label>
        </div> */}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm mb-2">
          Select Salary Category
        </label>
        <select
          name="salaryCategory"
          value={formData.salaryCategory}
          onChange={handleChange}
          className="border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select salary</option> {/* Placeholder option */}
          <option value="On Experience">On Experience</option>
          <option value="Competitive">Competitive</option>
          <option value="Fixed">Fixed</option>
          <option value="Negotiable">Negotiable</option>
          <option value="Confidential">Confidential</option>
          {/* <option value="5">5 Lakh</option>
          <option value="10">10 Lakh</option>
          <option value="15">15 Lakh</option>
          <option value="20">20 Lakh</option>
          <option value="25">25 Lakh</option> */}
          {/* Add more options as needed */}
        </select>
        {/* <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="salaryConfidential"
            checked={formData.salaryConfidential}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label className="text-gray-700 text-sm">
            Keep Salary Confidential
          </label>
        </div> */}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Job Location
        </label>
        <input
          type="text"
          name="jobLocation"
          value={formData.jobLocation}
          onChange={handleChange}
          className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Job Description
        </label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Job Requirements
        </label>
        {formData.requirements.map((req, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="requirements"
              value={req}
              onChange={(e) => handleArrayChange(index, e)}
              className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addRequirement}
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded mt-2"
        >
          Add Requirement
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Qualifications
        </label>
        {formData.qualifications.map((qual, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              name="qualifications"
              value={qual}
              onChange={(e) => handleArrayChange(index, e)}
              className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addQualification}
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded mt-2"
        >
          Add Qualification
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm  mb-2">
          Screening Questions
        </label>
        {formData.screeningQuestions.map((question, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              name="question"
              value={question.question}
              onChange={(e) => handleScreeningQuestionChange(index, e)}
              className=" border rounded text-xs w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Question"
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="mandatory"
                checked={question.mandatory}
                onChange={(e) => handleScreeningQuestionChange(index, e)}
                className="mr-2 leading-tight"
              />
              <label className="text-gray-700 text-sm ">Mandatory</label>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addScreeningQuestion}
          className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded mt-2"
        >
          Add Screening Question
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isLoading ? "Submiting...." : "Submit"}
      </button>
    </form>
  );
};

export default JobUploadPage;
