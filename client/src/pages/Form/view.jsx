import { useState } from "react";
import { Linkedin, Mail, Phone } from "lucide-react";
import logo from "../../assets/tlogo.png";
import { WhatsApp } from "@mui/icons-material";

export default function HighImpactTalentLanding({ handledeveloper }) {
  const [email, setEmail] = useState("");
  const [whatsappOptionsOpen, setWhatsAppOptionsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Special logic for tester@highimpact@developer
    if (email === "tester.highimpact@developer") {
      handledeveloper();
      return;
    }

    // Fallback: redirect to newsletter
    window.location.href = "https://shorturl.at/hlPP7";
  };

  const openWhatsApp = () => {
    const whatsappNumber = "918332052215";
    // Get current user information
    const currentUser = JSON.parse(localStorage.getItem("userInfo")) || {};
    // Prepare message with user info if available
    let message;
    if (currentUser.email) {
      const userName = currentUser.firstName
        ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim()
        : "User";
      message = `Hello, my name is ${userName}. I need assistance with `;
    } else {
      message = "Hello, I need assistance with ";
    }
    const encodedMessage = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send/?phone=${whatsappNumber}&text=${encodedMessage}`;
    } else {
      setWhatsAppOptionsOpen(true);
    }
  };

  const closeWhatsAppOptions = () => setWhatsAppOptionsOpen(false);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans"
      style={{ padding: "20px" }}
    >
      {/* Header section */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo and company name */}
            <div className="h-12 w-12 mr-4">
              {/* Simplified logo representation using CSS */}
              <img src={logo} alt="logo" />
            </div>
            <h1 className="hidden md:block text-3xl font-bold text-gray-800">
              High Impact Talent
            </h1>
          </div>

          {/* Social links */}
          <div className="flex space-x-4">
            <a
              href="https://www.linkedin.com/company/highimpacttalent/"
              className="text-blue-600 hover:text-blue-800 transition duration-300"
            >
              <Linkedin size={32} />
            </a>
            <button
              onClick={openWhatsApp}
              className="text-green-500 hover:text-green-700 transition duration-300"
            >
              <WhatsApp sx={{ fontSize: 32 }} />
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "mailto:highimpacttalentenquiry@gmail.com";
              }}
              className="text-gray-600 hover:text-gray-800 transition duration-300"
            >
              <Mail size={32} />
            </button>
          </div>
        </div>

        {/* WhatsApp options modal for desktop */}
        {whatsappOptionsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Contact via WhatsApp
              </h2>
              <p className="mb-4">Would you like to:</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    window.open(
                      `https://web.whatsapp.com/send?phone=918332052215&text=${encodeURIComponent(
                        currentUser?.email
                          ? message
                          : "Hello, I need assistance with "
                      )}`,
                      "_blank"
                    );
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Use Web
                </button>
                <button
                  onClick={closeWhatsAppOptions}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side content */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              high impact talent
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              we are matchmakers of executive talent and opportunity.
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-blue-400 to-green-500 mb-8"></div>
            <p className="text-lg text-gray-700 mb-10">
              access top candidates from{" "}
              <span className="font-semibold">
                top consulting firms,
                <br />
                Fortune 500 companies, investment funds, startups, and
                B-schools.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="http://calendly.com/koustubhharidas"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-center"
              >
                Schedule a call
              </a>
            </div>
          </div>

          {/* Right side image/graphic */}
          <div className="w-full md:w-2/5">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Subscribe to our newsletter
                </h3>
                <p className="text-gray-600">
                  Get the latest hiring insights and opportunities
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-lg shadow transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <div className="h-10 w-10 mr-3">
                  <div className="rounded-full bg-gradient-to-r from-orange-500 via-green-500 to-blue-400 h-full w-full"></div>
                </div>
                <h2 className="text-xl font-bold text-white">
                  High Impact Talent
                </h2>
              </div>
            </div>

            <div className="flex space-x-6">
              <a
                href="https://www.linkedin.com/company/highimpacttalent/"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <Linkedin size={20} />
              </a>
              <button
                onClick={openWhatsApp}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <WhatsApp sx={{ fontSize: 20 }} />
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "mailto:highimpacttalentenquiry@gmail.com";
                }}
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <Mail size={20} />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} High Impact Talent. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
