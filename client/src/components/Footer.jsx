import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { footerLinks } from "../utils/data";
import { Link } from "react-router-dom";
import TextInput from "./TextInput.jsx";
import CustomButton from "./CustomButton";

const Footer = () => {
  return (
    <footer className="text-white mp-20 overflow-x-hidden">
      <div className="overflow-x-hidden -mb-0.5"></div>

      <div className="bg-zinc-800">
        <div className="container px-5 py-20 mx-auto ">
          <div className="w-full flex flex-col items-center justify-center -mb-10 -px-4 ">
            <h2 className="font-bold text-[#1176DB] text-mb-3 flex gap-2 uppercase">
              {/* {title} */}
              <span className="font-bold">High</span>{" "}
              <span className="font-bold">Impact </span>{" "}
              <span className="font-bold">Talent</span>
            </h2>
            <div className="w-auto px-4 py-3">
              <div className="mb-10 flex flex-wrap items-center gap-3">
                <Link
                  to={"/"}
                  className="text-gray-300 text-sm hover:text-white"
                >
                  Home
                </Link>
                <div className="bg-white h-[3px] w-[3px] rounded-full"></div>
                <Link
                  to={"/about-us"}
                  className="text-gray-300 text-sm hover:text-white"
                >
                  About Us
                </Link>
                <div className="bg-white h-[3px] w-[3px] rounded-full"></div>
                <Link
                  to={"/contact-us"}
                  className="text-gray-300 text-sm hover:text-white"
                >
                  Contact
                </Link>
                <div className="bg-white h-[3px] w-[3px] rounded-full"></div>
                <Link
                  to="/privacy-policy"
                  className="text-gray-300 text-sm hover:text-white"
                >
                  Privacy & Policy
                </Link>
              </div>
            </div>
            <div className=" py-1 px-5 flex justify-center pb-10">
                <div className="text-gray-300 text-sm flex flex-col items-center ">
                  <span>&copy; 2024 HighImpactTalentenquiry</span>
                  <a
                    href="mailto:highimpacttalentenquiry@gmail.com"
                    className="text-[#1176DB] ml-1 font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    highimpacttalentenquiry@gmail.com
                  </a>
                </div>
              </div>
          </div>
        </div>

        {/* <div>
          <span className="inline-flex lg:ml-auto lg:mt-0 mt-6 w-full justify-center md:justify-center md:w-auto container mx-auto px-5 pt-6 pb-8 flex-wrap items-center">
            <a className="text-white text-xl hover:scale-125 ease-in-out duration-300">
              <FaFacebookF />
            </a>
            <a className="ml-3 text-white text-xl hover:scale-125 ease-in-out duration-300">
              <FaTwitter />
            </a>
            <a className="ml-3 text-white text-xl hover:scale-125 ease-in-out duration-300">
              <FiInstagram />
            </a>
            <a className="ml-3 text-white text-xl hover:scale-125 ease-in-out duration-300">
              <FaLinkedinIn />
            </a>
          </span>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
