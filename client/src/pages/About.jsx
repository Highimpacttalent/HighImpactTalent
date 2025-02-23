import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaUsers, FaRegLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8 space-y-20">
      {/* About Section with Animation */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="max-w-4xl w-full text-left"
      >
        <h1 className="text-4xl font-extrabold text-[#1176DB]">About High Impact Talent</h1>
        <p className="mt-6 text-lg text-gray-600">
          At High Impact Talent, we are dedicated to transforming the recruitment landscape by connecting top-tier strategic professionals with high-impact roles in leading organizations. Our mission is to bridge the gap between talent and opportunity, ensuring both job seekers and employers achieve their strategic goals. 
          <br /><br />
          We believe in a holistic approach to recruitment, where we not only match skills with job descriptions but also align values, culture, and long-term growth aspirations. Our expertise spans across industries, making sure every placement is not just a job filled, but a career built.
        </p>
      </motion.div>
      
      {/* Our Story Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaRegLightbulb className="text-[#1176DB]" /> Our Story
        </h2>
        <p className="mt-6 text-gray-600">
          Founded by experts from Bain & Company and the Mahindra Group, High Impact Talent was born out of a desire to solve the challenges faced by organizations in finding the right talent for strategic roles. 
          <br /><br />
          With our extensive industry knowledge and network, we are uniquely positioned to understand and meet the needs of both job seekers and employers. We work closely with both parties to create lasting professional relationships, ensuring that every placement is a step towards greater success.
        </p>
      </motion.div>
      
      {/* Our Vision Section */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaRegLightbulb className="text-[#1176DB]" /> Our Vision
        </h2>
        <p className="mt-6 text-gray-600">
          Our vision is to be the most trusted and effective recruitment partner for high-impact roles, driving success for individuals and organizations alike. 
          <br /><br />
          We aim to revolutionize the hiring process by leveraging data-driven insights, AI-powered recommendations, and human expertise to ensure the best possible match between candidates and companies.
        </p>
      </motion.div>
      
      {/* Our Team Section */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }} 
        whileInView={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <FaUsers className="text-[#1176DB]" /> Our Team
        </h2>
        <p className="mt-6 text-gray-600">
          Our leadership team consists of industry veterans who bring deep experience and expertise to the table. 
          <br /><br />
          <strong>Koustubh Haridas, Co-Founder & CEO (ex-Bain & Company):</strong> With years of strategic consulting experience, Koustubh drives the vision and growth of High Impact Talent.
          <br /><br />
          <strong>Umang Somani, Co-Founder & CFO (Mahindra Group):</strong> Umang's financial and operational acumen ensures seamless execution and continuous improvement in our services.
        </p>
      </motion.div>
      
      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
        className="max-w-4xl w-full text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
          <FaMapMarkerAlt className="text-[#1176DB]" /> Contact Information
        </h2>
        <div className="mt-6 text-gray-600">
          <p className="flex items-center justify-center gap-3">
            <FaEnvelope className="text-[#1176DB]" /> highimpacttalentenquiry@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
