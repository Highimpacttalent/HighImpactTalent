import React, { useState, useEffect } from "react";
import { CheckCircle, Mail, ArrowRight, Briefcase, Users, Search } from 'lucide-react';

import Hero from "../../../assets/Landing/Hero.png";
import Comp1 from "../../../assets/Landing/COmp1.svg";
import Comp2 from "../../../assets/Landing/Comp2.svg";
import Comp3 from "../../../assets/Landing/Comp3.png";
import Bottom from "../../../assets/Landing/Bottom.svg";
import PremiumSubscribeSection from "./Subscribe";


const MobileLanding = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState({}); // Mock user state
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribing:', email);
  };

  const handleNavigation = (path) => {
    console.log(`Navigating to: ${path}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Hero Image */}
            <div className="mb-2">
              <img 
                src={Hero} 
                alt="Hero" 
                className="h-48 md:h-64 mx-auto object-contain"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center gap-4 ">
              <button
                onClick={() => handleNavigation('/u-login')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium min-w-32"
              >
                Get a job
              </button>
              <button
                onClick={() => handleNavigation('/r-login')}
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium min-w-32"
              >
                Hire Now
              </button>
            </div>

            {/* Bottom Image */}
            <div >
              <img 
                src={Bottom} 
                alt="Bottom section" 
                className="w-full max-w-4xl mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* First Content Section - Job Seekers */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              Get Hired
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Cut through the noise. Land roles that actually fit.
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Tired of job hunts that lead nowhere? Tell us what you do
              best—and what you won't settle for. We'll match you with roles
              that truly fit.
            </p>

            {/* Component Image */}
            <div className="mb-8">
              <img 
                src={Comp1} 
                alt="Job matching component" 
                className="h-48 md:h-64 mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Second Content Section - Employers */}
      <section className="py-16 md:py-24 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-6 leading-tight">
              Streamline Your Hiring. Connect with Talent That Truly Fits.
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Our AI-driven platform helps you identify the right candidates
              — faster, smarter, and more effectively. Focus on what
              matters: hiring talent that sticks.
            </p>

            {/* Component Images */}
            <div className="space-y-8">
              <div className="flex justify-center">
                <img 
                  src={Comp2} 
                  alt="Hiring dashboard" 
                  className="max-w-full h-auto object-contain"
                />
              </div>
              
              <div className="flex justify-center">
                <img 
                  src={Comp3} 
                  alt="Talent matching" 
                  className="h-56 md:h-72 mx-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Subscribe Section */}
      <section>
        <PremiumSubscribeSection />
      </section>
    </div>
  );
};

export default MobileLanding;