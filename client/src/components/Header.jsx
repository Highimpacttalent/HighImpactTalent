import React, { useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineCloseCircle } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import CustomButton from "./CustomButton";

const SearchInput = ({ placeholder, icon, value, name, setValue, styles }) => {
  const [search, setSearch] = useState({
    jobname: '',
    joblocation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch((data) => ({ ...data, [name]: value }));
    setValue(value);
  };

  const clearInput = () => setValue("");

  return (
    <div className={`flex w-full items-center bg-white rounded-full shadow-md ${styles}`}>
      {icon}
      <input
        name={name}
        value={name === 'jobname' ? search.jobname : search.joblocation}
        onChange={handleChange}
        type="text"
        className="w-full p-3 outline-none bg-transparent text-sm md:text-base"
        placeholder={placeholder}
      />
      {value && (
        <AiOutlineCloseCircle
          className="text-gray-600 text-xl cursor-pointer mx-2"
          onClick={clearInput}
        />
      )}
    </div>
  );
};

const Header = ({
  title,
  type,
  handleClick,
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
}) => {
  return (
    <div className="relative bg-cover bg-center h-fit  flex items-center justify-center" >
      <div className=" rounded-xl w-full max-w-4xl mx-auto px-5 py-5">
        <div className="text-center mb-2 max-[550px]:hidden py-2">
          <p className="text-[#1176DB] font-bold italic text-4xl md:text-6xl">
            Find your Next Opportunity
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-between   rounded-full">
          <SearchInput
            placeholder="Job Title or Keywords"
            icon={<AiOutlineSearch className="text-gray-600 text-xl ml-3" />}
            name="jobname"
            value={searchQuery}
            setValue={setSearchQuery}
          />

          <div className="w-full md:w-auto">
            <CustomButton
              onClick={handleClick}
              title="Search"
              containerStyles={
                "w-full md:w-auto text-white py-2 md:py-3 px-5 md:px-10 focus:outline-none bg-[#1176DB] hover:bg-[#1176DB]/90 rounded-full text-sm md:text-base"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
