import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
      
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-[#1176DB]">
            Get in Touch with High Impact Talent
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            We'd love to hear from you! Whether you have questions about our
            services, need support, or want to provide feedback, our team is
            here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-6">
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900">Our Address</h2>
              <div className="mt-4 text-gray-600">
                {/* <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#1176DB]" /> 1234 Main Street, Anytown, USA
                </p> */}
                <p className="flex items-center gap-2 mt-2">
                  <FaEnvelope className="text-[#1176DB]" />{" "}
                  highimpacttalentenquiry@gmail.com
                </p>
                {/* <p className="flex items-center gap-2 mt-2">
                  <FaPhone className="text-[#1176DB]" /> +1 (123) 456-7890
                </p> */}
              </div>
              <div className="mt-6">
                <img
                  src="https://via.placeholde.com/400"
                  alt="Company Building"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            </div>

            <div className="bg-white p-6 shadow rounded-lg">
              <p className="text-xl font-bold text-gray-900">
                Connect with us on social media for the latest updates and
                industry insights.
              </p>
              {/* <div className="flex justify-center mt-4 space-x-6 text-gray-600">
                <a href="https://www.facebook.com" className="hover:text-[#14a800]">
                  <FaFacebook size={30} />
                </a>
                <a href="https://www.twitter.com" className="hover:text-[#14a800]">
                  <FaTwitter size={30} />
                </a>
                <a href="https://www.linkedin.com" className="hover:text-[#14a800]">
                  <FaLinkedin size={30} />
                </a>
                <a href="https://www.instagram.com" className="hover:text-[#14a800]">
                  <FaInstagram size={30} />
                </a>
              </div> */}
            </div>
          </div>

          <div className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-2xl font-bold text-[#1176DB]">
              Send Us a Message
            </h2>
            <form className="mt-4 space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#14a800] focus:border-[#14a800] sm:text-sm"
                  placeholder="Name"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#14a800] focus:border-[#14a800] sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#14a800] focus:border-[#14a800] sm:text-sm"
                  placeholder="Message"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#1176DB] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14a800]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
