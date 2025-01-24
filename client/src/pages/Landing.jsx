import React from "react";
import { FaSearch, FaBriefcase, FaUsers } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import man from "../assets/man.png";
import tlogo from "../assets/transparentlogo.png";
import toptt from "../assets/top-tier-talent.jpg";
import industry from "../assets/industri.jpg";
import personlized from "../assets/personlized.jpg";
const Landing = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <div className="overflow-x-hidden bg-[#234e94]">
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
