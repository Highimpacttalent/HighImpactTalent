import { useState } from "react";
import { Linkedin, Mail, Phone } from "lucide-react";
import { WhatsApp } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import logo from "../../assets/tlogo.png";

export default function HighImpactTalentLanding({ handledeveloper }) {
  const [email, setEmail] = useState("");
  const [whatsappOptionsOpen, setWhatsAppOptionsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

 const handleSubmit = async (e) => {
    e.preventDefault();

    // Special logic for tester@highimpact@developer
    if (email === "tester.highimpact@developer") {
      handledeveloper();
      return;
    }

    // Set submitting state
    setIsSubmitting(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("EMAIL", email);
      formData.append("email_address_check", "");
      formData.append("locale", "en");

      // Make POST request to the API
      const response = await fetch(
        "https://feb3b4bd.sibforms.com/serve/MUIFADuynwjYKMzhbXR3lcod0vsaRiXf1dgp7Ouf4wUS__zbtLywaZJKl9DerZ4S_coIR9xQkcb25NCCSZTNhRisYs27VALmXZEYYzkHRpFapr4Xe7slq6ir4su2gTeOxUKba0yb5rXHeh7xzh1y3G4_01O6C0OM6eQib8BqvZ7jlAIbZ88R5mFEItYw0P68AcTcwMIz-gDk9jJO?isAjax=1",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        // Show success message
        setSnackbarMessage(data.message);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        // Reset email field
        setEmail("");
      } else {
        // Show error message
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Show error message
      setSnackbarMessage("Failed to subscribe. Please try again later.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const openWhatsApp = () => {
    const whatsappNumber = "918332052215";
    const message = "Hello, I need assistance with ";
    const encoded = encodeURIComponent(message);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const url = isMobile
      ? // native app
        `whatsapp://send?phone=${whatsappNumber}&text=${encoded}`
      : // universal link (works desktop & mobile web)
        `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encoded}`;

    window.open(url, "_blank");
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
              <img src={logo} alt="High Impact Talent logo" />
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
              aria-label="Visit our LinkedIn page"
            >
              <Linkedin size={32} />
            </a>
            <button
              onClick={openWhatsApp}
              className="text-green-500 hover:text-green-700 transition duration-300"
              aria-label="Contact us on WhatsApp"
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
              aria-label="Email us"
            >
              <Mail size={32} />
            </button>
          </div>
        </div>

        {/* WhatsApp options modal for desktop */}
        {whatsappOptionsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                        "Hello, I need assistance with "
                      )}`,
                      "_blank"
                    );
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  Use Web
                </button>
                <button
                  onClick={closeWhatsAppOptions}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-12 md:py-16">
        {/* Main Headline Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Hiring's broken. We're fixing it.
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            We're building High Impact Talent—a smarter way to connect ambitious companies with people who actually get things done.
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mt-8"></div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-between gap-10">
          {/* Left side content (For Recruiters) */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-red-500 mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              For recruiters who are tired of long hiring cycles.
            </h3>
            <p className="text-lg text-gray-700 mb-6">
              We've helped startups and conglomerates close strategic roles in record time—with zero fluff and full ownership.
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Let's talk about how we can help you too.
            </p>

            <div className="mt-auto">
              <a
                href="http://calendly.com/koustubhharidas"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-center"
                title="Schedule hiring consult | High Impact Talent"
                aria-label="Book hiring strategy call"
              >
                Book a 30-min call →
              </a>
            </div>
          </div>

          {/* Right side content (For Candidates) */}
          <div className="w-full md:w-1/2 bg-white p-8 rounded-2xl shadow-lg">
            <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-blue-500 mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Be the first to know when we go live.
            </h3>
            <p className="text-lg text-gray-700 mb-4">
              No spam. No fluff. Just early access to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-6">
              <li className="mb-2">Curated roles from high-growth companies</li>
              <li className="mb-2">Updates on our launch</li>
              <li className="mb-2">Career stuff that's actually useful</li>
            </ul>

            <form id="job-alert-newsletter-form" onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Email for job updates newsletter"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-lg shadow transition duration-300"
                aria-label="Join job update newsletter"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 mt-16 rounded-lg">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                 <div className="h-10 w-10 mr-4 relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-green-500 p-0.5">
                                    <div className=" h-full w-full rounded-full flex items-center justify-center">
                                      <img
                                        src={logo}
                                        alt="High Impact Talent logo"
                                        className="h-8 w-8 object-contain"
                                      />
                                    </div>
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
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <button
                onClick={openWhatsApp}
                className="text-gray-300 hover:text-white transition duration-300"
                aria-label="WhatsApp"
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
                aria-label="Email"
              >
                <Mail size={20} />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm mb-2">
              Built by folks who've been in the trenches—at Bain, BCG, and beyond.
            </p>
            <p className="text-gray-400 text-sm">
              We've seen the process inside-out—and we're rebuilding it from scratch.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              © {new Date().getFullYear()} High Impact Talent. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Hidden SEO metadata */}
      <div style={{ display: "none" }}>
        <div itemScope itemType="http://schema.org/Organization">
          <meta itemProp="name" content="High Impact Talent" />
          <meta itemProp="description" content="We're building a hiring platform that helps companies move faster and candidates find roles that matter." />
        </div>
        <meta name="title" content="High Impact Talent | Smarter & Game-Changing Hiring Platform" />
        <meta name="description" content="We're building a hiring platform that helps companies move faster and candidates find roles that matter. Join the waitlist or schedule a call today." />
      </div>
      {/* Snackbar for form submission feedback */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert
                onClose={handleCloseSnackbar}
                severity={snackbarSeverity}
                variant="filled"
                sx={{
                  width: "100%",
                  backgroundColor:
                    snackbarSeverity === "success" ? "#2e7d32" : "#d32f2f",
                  color: "white",
                  fontWeight: "medium",
                  "& .MuiAlert-icon": {
                    color: "white",
                  },
                }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
    </div>
  );
}