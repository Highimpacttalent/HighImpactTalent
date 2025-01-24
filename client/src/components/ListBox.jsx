import { useState } from 'react';
import { BsCheck2, BsChevronExpand } from 'react-icons/bs';

const options = ["Newest", "Oldest", "A-Z", "Z-A"];

const ListBox = ({ sort, setSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility
  };

  const handleOptionClick = (option) => {
    setSort(option); // Set selected option
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className='relative w-[8rem] md:w-[10rem] z-[5]'>
      <button
        onClick={handleButtonClick}
        className='w-full py-2 px-4 bg-white  rounded-lg text-left flex items-center justify-between'
      >
        <span>{sort}</span>
        <BsChevronExpand className='text-gray-500' />
      </button>

      {isOpen && (
        <div className='absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg'>
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`py-2 px-4 cursor-pointer hover:bg-blue-500 hover:text-white ${
                sort === option ? 'bg-blue-500 text-white' : 'text-gray-900'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListBox;
