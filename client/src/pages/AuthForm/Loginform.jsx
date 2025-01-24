import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../utils';
import { useDispatch } from 'react-redux';
import { Login } from "../../redux/userSlice";
function Loginform() {
  const [isRecruiter, setIsRecruiter] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
//   const [isUser, setIsUser] = useState(true);
  const toggleForm = () => {
    setIsRecruiter(!isRecruiter);
    // Reset form fields when switching
    setEmail('');
    setPassword('');
  };
  
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [loading, setloadting] = useState(false);
  const navigate=useNavigate()
  const handleSubmit =async (e) => {
    e.preventDefault();
    const role = isRecruiter ? 'Recruiter' : 'User';
    console.log(`Logging in as ${role}`);
    console.log('Email:', email);
    console.log('Password:', password);
    // Handle form submission here (e.g., send data to backend)
    if(isRecruiter){
        
        // 
        try {
            const newData ={email:email,password:password}
            setloadting(true);
            const res = await apiRequest({
              url:'companies/login',
              method: "POST",
              data: newData,
            });
            console.log(res);
            if (res?.success) {
              setErrMsg("");
              const userData = { token: res?.token, ...res?.user };
              dispatch(Login(userData));
              localStorage.setItem("userInfo", JSON.stringify(userData));
              navigate('/upload-a-job')
            } else {
                setErrMsg(res?.message);
            }
          } catch (error) {
            console.log(error);
            
          }finally{
            setloadting(false);
          }
    }else{
        try {
            const newData ={email:email,password:password}
            setloadting(true);
            const res = await apiRequest({
              url:'user/login',
              method: "POST",
              data: newData,
            });
            console.log(res);
            if (res?.status === "failed") {
              setErrMsg(res?.message);
            } else {
              setErrMsg("");
              const userData = { token: res?.token, ...res?.user };
              dispatch(Login(userData));
              localStorage.setItem("userInfo", JSON.stringify(userData));
              navigate("/find-jobs")
            }
          } catch (error) {
            console.log(error);
          }finally{
            setloadting(false);
          }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        
        <div className="flex justify-around mb-6 w-full">
          <button
            className={`py-2 w-full px-4  ${
              !isRecruiter ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsRecruiter(false)}
          >
            User
          </button>
          <button
            className={`py-2 px-4 w-full  ${
              isRecruiter ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setIsRecruiter(true)}
          >
            
            Recruiter
          </button>
        </div>
        <form onSubmit={handleSubmit}>
        {/* <h2 className="text-2xl font-semibold text-center mb-6">
          {isRecruiter ? 'Recruiter' : 'User'} Login
        </h2> */}
          <div className="mb-4">
            {/* <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label> */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <div className="mb-6">
            {/* <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label> */}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 capitalize"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 hover:bg-blue-600 transition-colors mb-2"
          >
            {loading?"Loading...":"Login"}
          </button>
          <div>Do not have an account ? <Link to={'/authform'} className="text-blue-500 border-b border-blue-500">Create account</Link></div>
        </form>
        <button
          onClick={toggleForm}
          className="mt-4 text-blue-500 hover:underline focus:outline-none"
        >
          {isRecruiter ? 'Login as User' : 'Login as Recruiter'}
        </button>
      </div>
    </div>
  );
}

export default Loginform;