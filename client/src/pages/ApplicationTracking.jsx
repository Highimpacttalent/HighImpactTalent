import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ApplicationTracking = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user)
  
  useEffect(() => {
    const application = async()=>{
      try {
        const res =await axios.get(`https://demojobportal.onrender.com/api-v1/application/get-allapplication/${user._id}`)
        console.log(res.data.data)
        if(res){
          setApplications(res.data.data)
          setIsLoading(false)
        }
      } catch (error) {
        console.log(error)
      }
    }
    application()
      
  }, []);
  

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Application Tracking</h1>
      <div className="bg-white p-6 shadow rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left">Company</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              {/* <th className="py-2 px-4 border-b text-left">Applied On</th> */}
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center">No applications found.</td>
              </tr>
            ) : (
              applications.map((app,index) =>{
                return <tr key={index}>
                  <td className="py-2 px-4 border-b">{app.job.jobTitle}</td>
                  <td className="py-2 px-4 border-b">{app.company.name}</td>
                  <td className="py-2 px-4 border-b">{app.status}</td>
                </tr>
              } )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationTracking;