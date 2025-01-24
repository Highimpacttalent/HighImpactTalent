import axios from 'axios'
import React, { useEffect, useState } from 'react'

const ApplicationStatus = () => {
    const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
    // const [data,setData]=useState({})
    const [applications, setApplications] = useState();
    useEffect(() => {
        const application = async()=>{
          try {
            const res = await axios.get('http://localhost:8800/api-v1/application/get/66aa771d94c84dc3df30e847')
            console.log(res.data.data)
            setApplications(res.data.data)
          } catch (error) {
            console.log(error)
          }
        }
        application()
          
      }, [])
  return (
    <>
    {/* <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Application Tracking</h1>
      <div className="bg-white p-6 shadow rounded-lg">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Job Title</th>
              <th className="py-2 px-4 border-b text-left">Company</th>
              <th className="py-2 px-4 border-b text-left">Status</th>
              <th className="py-2 px-4 border-b text-left">Applied On</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center">No applications found.</td>
              </tr>
            ) : (
                <tr key={app.id}>
                  <td className="py-2 px-4 border-b">{app.jobTitle}</td>
                  <td className="py-2 px-4 border-b">{app.company}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`flex items-center gap-2 ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                      {app.status === 'Approved' ? <FaCheckCircle /> : app.status === 'Rejected' ? <FaTimesCircle /> : <FaClock />}
                      {app.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{new Date(app.appliedOn).toLocaleDateString()}</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div> */}
    </>
  )
}

export default ApplicationStatus