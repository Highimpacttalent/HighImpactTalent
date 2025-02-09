import React,{useState,useEffect} from "react";
import { FaSearch, FaBriefcase, FaUsers } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import man from "../assets/man.png";
import { useNavigate } from "react-router-dom";
import tlogo from "../assets/transparentlogo.png";
import toptt from "../assets/top-tier-talent.jpg";
import industry from "../assets/industri.jpg";
import personlized from "../assets/personlized.jpg";

const Landing = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  const LoginModal = (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-[90%] max-w-md text-center">
            {/* Welcome Section */}
            <Dialog.Title className="text-2xl md:text-3xl font-bold text-gray-800">
              Connect. Hire. Grow.
            </Dialog.Title>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Whether you're seeking the perfect job or the best talent, we make connections effortless.
            </p>
  
            {/* Benefits Section */}
            <div className="text-left text-gray-700 text-sm md:text-base mt-2">
              <p className="font-semibold text-gray-800">For Job Seekers:</p>
              <ul className="space-y-2">
                <li>🚀 Explore top job opportunities</li>
                <li>📈 Get noticed by leading companies</li>
                <li>🎯 Build your career with expert guidance</li>
              </ul>
  
              <p className="font-semibold text-gray-800 mt-3">For Recruiters:</p>
              <ul className="space-y-2">
                <li>🔍 Find top talent quickly & efficiently</li>
                <li>📢 Post job listings with ease</li>
                <li>🤝 Connect with the right candidates</li>
              </ul>
            </div>
  
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => navigate("/authlogin")}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/authform")}
                className="bg-gray-600 text-white py-3 px-6 rounded-lg text-lg shadow-md hover:bg-gray-700 transition duration-300"
              >
                Sign Up
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
  
  

  return (
    <div className="overflow-x-hidden bg-[#234e94]">
      {LoginModal}
      <div className="hero h-screen max-[900px]:h-fit">
        <div className="h-full w-full bg-white flex flex-col md:flex-row justify-between items-center p-8 md:p-12">
          <div className="flex flex-col gap-4 md:w-1/2 animate-fadeIn">
            <h1 className="text-zinc-800  flex flex-col">
              <span className="text-2xl font-semibold  md:text-3xl lg:text-5xl">
                Transform Your Future
              </span>
              <span className="text-2xl font-semibold md:text-3xl lg:text-5xl">
                with High Impact Talent
              </span>
            </h1>
            <p className="text-md md:text-xl text-gray-700 max-w-md">
              Bridging the Gap Between Top-Tier Strategic Professionals and
              Leading Organizations.
            </p>
            <div className="flex gap-3 mt-4 flex-col sm:flex-row">
              <Link
                to="/authform"
                className="bg-blue-600 text-white text-sm md:text-base py-3 px-6 rounded-lg shadow hover:bg-blue-700"
              >
                Find Your Next Opportunity
              </Link>
              <Link
                to="/authform"
                className="bg-blue-600 text-white text-sm md:text-base py-3 px-6 rounded-lg shadow hover:bg-blue-700"
              >
                Find Candidates For Your Team
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
            <div className="w-[300px] sm:w-[400px] p-4 rounded-lg ">
              <img
                src={man}
                alt="Professional"
                className="w-full h-auto rounded-md"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center bg-white py-5 px-5 max-[600px]:flex-col overflow-x-hidden">
          <div className="w-1/4 max-[600px]:w-3/4 bg-white rounded-full shadow-lg p-4">
            <img
              src={tlogo}
              alt="Company Logo"
              className="w-full h-auto rounded-full"
            />
          </div>
          <div className="w-3/4 max-[600px]:w-full mt-6 max-[600px]:mt-4">
            <p className="text-lg md:text-xl px-[3vw] py-8 text-center text-darkBlue leading-relaxed">
              Welcome to{" "}
              <span className="text-blue-600 font-semibold">
                High Impact Talent
              </span>
              , your premier destination for connecting exceptional talent with
              high-impact roles. Whether you're a job seeker aiming to elevate
              your career or an employer searching for strategic professionals
              to drive your business forward, we are here to make it happen.
              <br />
              <br />
              Founded by seasoned experts from{" "}
              <span className="text-blue-600 font-semibold">
                Bain & Company
              </span>{" "}
              and the{" "}
              <span className="text-blue-600 font-semibold">
                Mahindra Group
              </span>
              , we specialize in strategic recruitment that aligns with your
              goals.
            </p>
          </div>
        </div>

        <div className="h-fit py-10 px-4 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center w-full gap-10 text-lg">
            <div className="border border-blue-600 w-full max-w-[800px] p-8 flex flex-col md:flex-row items-center gap-6 bg-white rounded-lg shadow-lg">
              <div className="max-w-[200px] md:max-w-[300px] w-full">
                <img
                  src={toptt}
                  alt="Top-Tier Talent"
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="text-darkBlue flex flex-col text-center md:text-left">
                <strong className="text-xl font-semibold text-blue-600">
                  Top-Tier Talent:
                </strong>
                <p className="mt-2">
                  Access a curated pool of professionals with expertise in
                  digital transformation, sustainability, data-driven
                  decision-making, and more.
                </p>
              </div>
            </div>

            <div className="border border-blue-600 w-full max-w-[800px] p-8 flex flex-col md:flex-row items-center gap-6 bg-white rounded-lg shadow-lg">
              <div className="text-darkBlue flex flex-col text-center md:text-left">
                <strong className="text-xl font-semibold text-blue-600">
                  Industry Insights:
                </strong>
                <p className="mt-2">
                  Stay ahead with the latest hiring trends and strategies for
                  2024 and beyond.
                </p>
              </div>
              <div className="max-w-[200px] md:max-w-[300px] w-full">
                <img
                  src={industry}
                  alt="Industry Insights"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </div>

            <div className="border border-blue-600 w-full max-w-[800px] p-8 flex flex-col md:flex-row items-center gap-6 bg-white rounded-lg shadow-lg">
              <div className="max-w-[200px] md:max-w-[300px] w-full">
                <img
                  src={personlized}
                  alt="Personalized Matching"
                  className="w-full h-auto rounded-md"
                />
              </div>
              <div className="text-darkBlue flex flex-col text-center md:text-left">
                <strong className="text-xl font-semibold text-blue-600">
                  Personalized Matching:
                </strong>
                <p className="mt-2">
                  Our advanced algorithms and expert team ensure the best fit
                  for both candidates and employers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
