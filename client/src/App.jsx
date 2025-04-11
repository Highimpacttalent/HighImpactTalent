import { useState } from "react";
import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { About, Companies, CompaniesProfile, JobDetails, FindJob} from "./pages/index";
import { useSelector } from "react-redux";
import Dashboard from "./pages/DashBoard";
import Contact from "./pages/Contact";
import ViewResumeProfile from "./pages/ResumeSearch/ViewResume/view";
import ApplicationTracking from "./pages/ApplicationTracking";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUsPage from "./pages/ContactUs/view";
import TermsAndConditions from "./components/terms";
import Landing2 from "./pages/Landing/Landing2/view";
import RefundPolicy from "./components/Refund";
import ApplicationStatus from "./pages/ApplicationStatus";
import PasswordChange from "./pages/Password";
import ScreeningView from "./pages/Screening/view";
import FloatingChatAssistant from "./components/Chat/FloatingChat";
import UserInfoForm from "./pages/UserAdditionalDetails/view";
import JobUploadPage from "./pages/UploadJob/view.jsx";
import ProfileSection from "./pages/Profile/view";
import UserLoginForm from "./pages/AuthForm/u-login";
import ResumeSearch from "./pages/ResumeSearch/view";
import BlogPage2 from "./pages/Blog/desktop"
import ViewJobs from "./pages/ViewJobs";
import LandingMain from "./pages/Landing/LandingMain/view";
import SingleBlog from "./pages/SingleBlog";
import JobApplications from "./pages/ViewApplicants";
import ResumeUpload from "./pages/UserDetailsUpload/userInfo";
import RecruiterSchedule from "./pages/RecruiterSchedule";
import RecruiterSignup from "./pages/AuthForm/Recruiter-Auth";
import UserSignUp from "./pages/AuthForm/User-Auth";
import CompanyLoginForm from "./pages/AuthForm/r-login";
import RecruiterRedirectPage from "./pages/EndSignUp";
import PayUPaymentPage from "./pages/Payments/PaymentPage";
import PaymentSuccess from "./pages/Payments/PaymentSuccess";
import PaymentFailure from "./pages/Payments/PaymentFailure";
import LinkedInCallback from "./pages/AuthForm/LinkedInCallback";
import PaymentProtectedRoute from "./pages/Payments/PaymentProtectedRoute.jsx";

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
          <Route path="/" element={<LandingMain/>}></Route>
          <Route path="/home" element={<Landing2/>}></Route>
          <Route path='/find-jobs' element={<FindJob />} />
          <Route path='/view-jobs' element={<ViewJobs />} />
          <Route path="/applicant/:jobId" element={<JobApplications />}/>
          <Route path='/companies' element={<Companies />} />
          <Route path={"/user-profile"} element={<ProfileSection />} />
          {/* <Route path={"/company-profile"} element={<CompaniesProfile />} />
          <Route path={"/company-profile/:id"} element={<CompaniesProfile />} />
          <Route path={"/company-profile/job-detail/:id"} element={<CompaniesProfile />} /> */}
          <Route path={"/job-detail/:id"} element={<JobDetails />} />
          <Route path="/job-detail/:id/screening-questions" element={<ScreeningView/>}></Route>
          <Route path={'/applicationstatus'} element={<ApplicationStatus/>}></Route>
          <Route path={'/recruiterSchedule'} element={<RecruiterSchedule/>}></Route>
          <Route element={<PaymentProtectedRoute />}>
          <Route path={'/resumesearch'} element={<ResumeSearch/>}></Route>
          <Route path="/resumesearch/viewresume/:resumeId" element={<ViewResumeProfile />} />
          </Route>
          <Route path={'/userinformation'} element={<ResumeUpload/>}></Route>
          <Route path={'/password'} element={<PasswordChange/>}></Route>
          <Route path={'/payment'} element={<PayUPaymentPage/>}></Route>
          <Route path={"/payment-success"} element={<PaymentSuccess />} />
          <Route path={"/payment-failure"} element={<PaymentFailure />} />
          
        </Route>
        <Route path="/r-authform" element={<RecruiterSignup/>}></Route>
        <Route path="/u-authform" element={<UserSignUp/>}></Route>
        <Route path="/u-login" element={<UserLoginForm/>}></Route>
        <Route path="/r-login" element={<CompanyLoginForm/>}></Route>
        <Route path="/linkedin-callback" element={<LinkedInCallback />} />
        <Route path="/endlogin" element={<RecruiterRedirectPage/>}></Route>
        <Route path="/user-additional-details" element={<UserInfoForm/>}></Route>
        <Route path="/upload-a-job" element={<JobUploadPage/>}></Route>
        <Route path='/about-us' element={<About />} />
        <Route path='/contact-us' element={<ContactUsPage/>} />
        <Route path="/admin-dashboard" element={<Dashboard />} />
        <Route path="/t&c" element={<TermsAndConditions />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/blog" element={<BlogPage2/>}></Route>
        <Route path="/blog/:blogId" element={<SingleBlog/>}></Route>
        <Route path="/application-tracking" element={<ApplicationTracking />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />


      </Routes>
      {user && <FloatingChatAssistant />} 
      {user && <Footer />}
    </main>
  );
}
export default App;
