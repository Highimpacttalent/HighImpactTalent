import { useState } from "react";
import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { About, Auth, Companies, CompaniesProfile, FindJob, JobDetails, UploadJobs, UserProfile} from "./pages/index";
import { useSelector } from "react-redux";
import Dashboard from "./pages/DashBoard";
import Contact from "./pages/Contact";
import ApplicationTracking from "./pages/ApplicationTracking";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ApplicationStatus from "./pages/ApplicationStatus";
import UploadResume from "./pages/UploadResume";
import Landing from "./pages/Landing";
import ScreeningQuestions from "./pages/ScreeningQuestions";
import UserInfoForm from "./pages/UserInfoForm";
import JobUploadPage from "./pages/JobUploadPage";
import AuthForm from "./pages/AuthForm/AuthForm";
import Loginform from "./pages/AuthForm/Loginform";
import BlogPage from "./pages/BlogPage";
import SingleBlog from "./pages/SingleBlog";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  return <Outlet/>
  // return user?.token ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to='/user-auth' state={{ from: location }} replace />
  // );
}
function App() {
  const { user } = useSelector((state) => state.user);
  return (
    <main className='bg-[#f3f4f6] font-[Poppins] tracking-tighter '>
      <div className="fixe w-full z-[1000]  bg-white">
      <Navbar />
      <hr />
      </div>
      
      <Routes>
        <Route element={<Layout />}>
          {/* <Route
            path='/'
            element={<Navigate to='/find-jobs' replace={true} />}
          /> */}
          <Route path="/" element={<Landing/>}></Route>
          <Route path='/find-jobs' element={<FindJob />} />
          <Route path='/companies' element={<Companies />} />
          <Route
            path={
              user?.user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />} 
          />
          <Route path={"/company-profile"} element={<CompaniesProfile />} />
          <Route path={"/company-profile/:id"} element={<CompaniesProfile />} />
          <Route path={"/company-profile/job-detail/:id"} element={<CompaniesProfile />} />
          <Route path={"/upload-job"} element={<UploadJobs />} />
          <Route path={"/job-detail/:id"} element={<JobDetails />} />
          <Route path="/job-detail/:id/screening-questions" element={<ScreeningQuestions/>}></Route>
          <Route path={'/applicationstatus'} element={<ApplicationStatus/>}></Route>
          
        </Route>
        <Route path="/authform" element={<AuthForm/>}></Route>
        <Route path="/authlogin" element={<Loginform/>}></Route>
        <Route path="/user-additional-details" element={<UserInfoForm/>}></Route>
        <Route path="/upload-a-job" element={<JobUploadPage/>}></Route>
        <Route path='/about-us' element={<About />} />
        <Route path='/user-auth' element={<Auth/>} />
        <Route path='/contact-us' element={<Contact/>} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/upload-resume" element={<UploadResume />} />
        <Route path="/blog" element={<BlogPage/>}></Route>
        <Route path="/blog/:blogId" element={<SingleBlog/>}></Route>
        <Route path="/application-tracking" element={<ApplicationTracking />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />



      </Routes>
      {user && <Footer />}
    </main>
  );
}
export default App;
