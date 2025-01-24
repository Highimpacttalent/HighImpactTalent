import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useSelector, useDispatch } from "react-redux";
import { Logout } from "../redux/userSlice";
import logo from '../assets/tlogo.png';

function MenuList({ user, onClick }) {
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(Logout());
    window.location.replace("/");
  };

  return (
    <Menu as="div" className="inline-block text-left">
      <div>
        <Menu.Button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full">
          <div className="p-1 border border-black/20 rounded-full">
          <img
            src={user?.profileUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010"}
            alt="user profile"
            className="w-4 h-4 rounded-full object-cover"
          />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold">{user?.firstName ?? user?.name}</p>
          </div>
          <BiChevronDown className="h-6 w-6 text-gray-600" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to={`${
                    user?.accountType ? `/user-profile/${user?._id}` : "company-profile"
                  }`}
                  className={`${
                    active ? "bg-[#1176DB] text-white" : "text-gray-700"
                  } group flex items-center px-4 py-2 text-sm`}
                  onClick={onClick}
                >
                  <CgProfile
                    className={`${
                      active ? "text-white" : "text-gray-600"
                    } mr-2 h-5 w-5`}
                    aria-hidden="true"
                  />
                  {user?.accountType ? "User Profile" : "Company Profile"}
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? "bg-red-500 text-white" : "text-gray-700"
                  } group flex items-center px-4 py-2 text-sm w-full`}
                >
                  <AiOutlineLogout
                    className={`${
                      active ? "text-white" : "text-gray-600"
                    } mr-2 h-5 w-5`}
                    aria-hidden="true"
                  />
                  Log Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-1">
      <nav className="container mx-auto flex items-center justify-between p-1 lg:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="text-md font-semibold text-blue-500">High Impact Talent</span>
        </Link>

        <ul className="hidden lg:flex gap-8 text-base text-gray-700">
          {(!user?.jobPosts) && (
            <li className="hover:text-[#1176DB] transition">
              <Link to="/find-jobs">Find Job</Link>
            </li>
          )}
          {user?.accountType === "seeker" && (
            <li className="hover:text-[#1176DB] transition">
              <Link to="/companies">Companies</Link>
            </li>
          )}
          {user?.token && user?.accountType !== "seeker" && (
            <li className="hover:text-[#1176DB] transition">
              <Link to="/upload-job">Upload Job</Link>
            </li>
          )}
          <li className="hover:text-[#1176DB] transition">
            <Link to="/about-us">About</Link>
          </li>
          <li className="hover:text-[#1176DB] transition">
            <Link to="/contact-us">Contact Us</Link>
          </li>
          <li className="hover:text-[#1176DB] transition">
            <Link to="/blog">blog</Link>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          {!user?.token ? (
            <Link to="/authform">
              <CustomButton
                title="Sign In"
                containerStyles="text-[#14a800] border border-[#14a800] py-1.5 px-5 hover:bg-[#14a800] hover:text-white rounded-full transition"
              />
            </Link>
          ) : (
            <MenuList user={user} />
          )}
        </div>

        <button
          className="lg:hidden text-gray-700 focus:outline-none"
          onClick={handleCloseNavbar}
        >
          {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <Transition
        show={isOpen}
        enter="transition duration-200 ease-out"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition duration-100 ease-in"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="lg:hidden bg-white shadow-md">
          <div className="container mx-auto flex flex-col p-5 gap-3">
            <Link to="/find-jobs" onClick={handleCloseNavbar}>
              Find Job
            </Link>
            {user?.accountType === "seeker" && (
              <Link to="/companies" onClick={handleCloseNavbar}>
                Companies
              </Link>
            )}
            {user?.token && user?.accountType !== "seeker" && (
              <Link to="/upload-job" onClick={handleCloseNavbar}>
                Upload Job
              </Link>
            )}
            <Link to="/about-us" onClick={handleCloseNavbar}>
              About
            </Link>
            <Link to="/contact-us" onClick={handleCloseNavbar}>
              Contact Us
            </Link>
            <Link to="/blog" onClick={handleCloseNavbar}>
              Blog
            </Link>
            <div className="mt-5">
              {!user?.token ? (
                <Link to="/authform" onClick={handleCloseNavbar}>
                  <CustomButton
                    title="Sign In"
                    containerStyles="text-[#14a800] border border-[#14a800] py-1.5 px-5 w-full text-center hover:bg-[#14a800] hover:text-white rounded-full transition"
                  />
                </Link>
              ) : (
                <MenuList user={user} onClick={handleCloseNavbar} />
              )}
            </div>
          </div>
        </div>
      </Transition>
    </header>
  );
};

export default Navbar;
