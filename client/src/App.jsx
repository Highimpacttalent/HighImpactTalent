import { useState,useEffect } from "react";
import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {  Companies, CompaniesProfile, JobDetails, FindJob} from "./pages/index";
import About from "./pages/About/view.jsx"
import { useSelector } from "react-redux";
import Dashboard from "./pages/DashBoard";
import Contact from "./pages/Contact";
import ViewResumeProfile from "./pages/ResumeSearch/ViewResume/view";
import ApplicationTracking from "./pages/ApplicationTracking/view.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUsPage from "./pages/ContactUs/view";
import View from "./pages/JobPost/components/ViewDetails/View.jsx";
import TermsAndConditions from "./components/terms";
import AiResumeSearch from "./pages/AiResumeSearch/view.jsx";
import JobPosted from "./pages/JobPost/view.jsx";
import RecuiterProfile from "./pages/RecruiterProfile/view.jsx";
import Landing2 from "./pages/Landing/Landing2/view";
import RefundPolicy from "./components/Refund";
import ApplicationStatus from "./pages/ApplicationStatus";
import PasswordChange from "./pages/Password";
import ScreeningView from "./pages/Screening/view";
import FloatingChatAssistant from "./components/Chat/FloatingChat";
import HiringPlatformLanding from "./pages/Landing/LandingMain/desktop2.jsx";
import UserInfoForm from "./pages/UserAdditionalDetails/main.jsx";
import ViewProfile from "./pages/Applicants/ViewProfile.jsx";
import JobUploadPage from "./pages/UploadJob/test.jsx";
import ProfileSection from "./pages/Profile/view";
import UserLoginForm from "./pages/AuthForm/u-login";
import ResumeSearch from "./pages/ResumeSearch/view";
import BlogPage2 from "./pages/Blog/desktop"
import ViewJobs from "./pages/ViewJobs";
import LandingMain from "./pages/Landing/LandingMain/view";
import SingleBlog from "./pages/SingleBlog";
import JobApplications from "./pages/Applicants/ViewApplicants.jsx";
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
import JobRecommendationsComponent from "./pages/Match/view.jsx";
import HighImpactTalentLanding from "./pages/Form/view2.jsx";
import RecruitmentChatbot from "./pages/AIChatbot/view.jsx" 

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
  const [developer, setDeveloper] = useState(false);

  // Check localStorage for developer flag on mount
  useEffect(() => {
    const devValue = localStorage.getItem('developer');
    if (devValue === 'developer@highimpact') {
      setDeveloper(true);
    } else {
      setDeveloper(false);
    }
  }, []);

  // Handler to set developer flag
  const handledeveloper = () => {
    localStorage.setItem('developer', 'developer@highimpact');
    setDeveloper(true);
  };

  if(!developer){
    return <HighImpactTalentLanding handledeveloper={handledeveloper}/>
  }

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
          <Route path="/" element={<LandingMain/>} />
          <Route path="/home" element={<Landing2/>} />
          <Route path='/find-jobs' element={<FindJob />} />
          <Route path='/view-jobs' element={<JobPosted />} />
          <Route path="/applicant/:jobId" element={<JobApplications />}/>
          <Route path='/companies' element={<Companies />} />
          <Route path={"/user-profile"} element={<ProfileSection />} />
          <Route path={"/rec-profile"} element={<RecuiterProfile/>} />
          {/* <Route path={"/company-profile"} element={<CompaniesProfile />} />
          <Route path={"/company-profile/:id"} element={<CompaniesProfile />} />
          <Route path={"/company-profile/job-detail/:id"} element={<CompaniesProfile />} /> */}
          <Route path={"/job-detail/:id"} element={<JobDetails />} />
          <Route path="/job-detail/:id/screening-questions" element={<ScreeningView/>}></Route>
          <Route path={'/applicationstatus'} element={<ApplicationStatus/>}></Route>
          <Route path={'/recruiterSchedule'} element={<RecruiterSchedule/>}></Route>
          <Route element={<PaymentProtectedRoute />}>
          <Route path={'/resumesearch'} element={<ResumeSearch/>}></Route>
          <Route path="/resumesearch/viewresume/:resumeId" element={<ViewResumeProfile />} /></Route>
          <Route path="/matches" element={<JobRecommendationsComponent/>}/>
          <Route path={'/userinformation'} element={<ResumeUpload/>}></Route>
          <Route path={'/password'} element={<PasswordChange/>}></Route>
          <Route path={'/view-job-post'} element={<View/>}></Route>
          <Route path={'/payment'} element={<PayUPaymentPage/>}></Route>
          <Route path={"/payment-success"} element={<PaymentSuccess />} />
          <Route path={"/payment-failure"} element={<PaymentFailure />} />
          <Route path={"/view-profile"} element={<ViewProfile />} />
          <Route path={"/ai-resume"} element={<AiResumeSearch />} />
          
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
        <Route path="/ai-chat" element={<RecruitmentChatbot />} />

      </Routes>
      {user && <FloatingChatAssistant />} 
      {user && <Footer />}
    </main>
  );
}
export default App;
