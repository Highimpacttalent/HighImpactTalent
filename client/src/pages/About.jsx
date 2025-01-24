import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaUsers, FaRegLightbulb } from 'react-icons/fa';

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl font-extrabold text-[#1176DB]">
            About High Impact Talent
          </h1>
          <p className="mt-2 text-center text-lg text-gray-600">
          At High Impact Talent, we are dedicated to transforming the recruitment landscape by connecting top-tier strategic professionals with high-impact roles in leading organizations. Our mission is to bridge the gap between talent and opportunity, ensuring both job seekers and employers achieve their strategic goals.
          </p>
        </div>
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaRegLightbulb className="text-[#1176DB]" /> Our Story
          </h2>
          <p className="mt-4 text-gray-600">
          Founded by experts from Bain & Company and the Mahindra Group, High Impact Talent was born out of a desire to solve the challenges faced by organizations in finding the right talent for strategic roles. With our extensive industry knowledge and network, we are uniquely positioned to understand and meet the needs of both job seekers and employers.
          </p>
        </div>
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaRegLightbulb className="text-[#1176DB]" /> Our Vision
          </h2>
          <p className="mt-4 text-gray-600">
          To be the most trusted and effective recruitment partner for high-impact roles, driving success for individuals and organizations alike.
          </p>
        </div>
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaRegLightbulb className="text-[#1176DB]" /> Our Mission
          </h2>
          <p className="mt-4 text-gray-600">
          To match key strategic requirements in the industry with best-in-class talent, fostering growth and innovation.
          </p>
        </div>
        <div className="bg-white p-8 shadow rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaUsers className="text-[#1176DB]" /> Our values
          </h2>
          <div className="mt-4 text-gray-600">
            <div><h3>Integrity :</h3><p className='pl-5'>We maintain the highest standards of honesty and transparency in all our interactions.</p></div>
            <div><h3>Excellence :</h3><p className='pl-5'>We strive for excellence in everything we do, from talent matching to customer service.</p></div>
            <div><h3>Innovation :</h3><p className='pl-5'>We embrace innovation to stay ahead of industry trends and provide the best solutions.</p></div>
          </div>
        </div>
        <div className="bg-white p-8 shadow rounded-lg mt-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaUsers className="text-[#1176DB]" /> Our Team
          </h2>
          <ul className="mt-4 list-disc list-inside text-gray-600">
            <li>Koustubh Haridas, Co-Founder & CEO (ex-Bain & Company)</li>
            <li>Umang Somani , Co-Founder & CFO (Mahindra Group)</li>
          </ul>
        </div>
        <div><h1 className='text-2xl'>Ready to find your perfect match? [Join Us Today]</h1></div>
        <div className="bg-white p-8 shadow rounded-lg mt-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaMapMarkerAlt className="text-[#1176DB]" /> Contact Information
          </h2>
          <div className="mt-4 text-gray-600">
            {/* <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#1176DB]" /> 1234 Main Street, Anytown, USA
            </p> */}
            <p className="flex items-center gap-2 mt-2">
              <FaEnvelope className="text-[#1176DB]" /> highimpacttalentenquiry@gmail.com
            </p>
            {/* <p className="flex items-center gap-2 mt-2">
              <FaPhone className="text-[#1176DB]" /> +1 (123) 456-7890
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
