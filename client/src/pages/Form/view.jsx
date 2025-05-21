import { useState, useEffect } from "react";
import { Linkedin, Mail, ChevronRight, ArrowRight } from "lucide-react";
import { WhatsApp, Close } from "@mui/icons-material";
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

  useEffect(() => {
    // Set initial visibility after a short delay for animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div className="relative min-h-screen font-sans bg-black text-white overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-green-500 rounded-full filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-1/4 h-1/4 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBmaWxsPSIjMjAyMDIwIiBmaWxsLW9wYWNpdHk9Ii4yIi8+PHBhdGggZD0iTTMwIDBIMHYzMGgzMHoiIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iLjIiLz48L2c+PC9zdmc+')] opacity-30"></div>

      {/* Main content container */}
      <div className="relative">
        {/* Navbar - becomes sticky and changes background when scrolled */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-black bg-opacity-80 backdrop-blur-md py-4 shadow-md"
              : "bg-transparent py-6"
          }`}
        >
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                {/* Logo and company name */}
                <div className="h-10 w-10 mr-4 relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-green-500 p-0.5">
                  <div className="bg-black h-full w-full rounded-full flex items-center justify-center">
                    <img
                      src={logo}
                      alt="High Impact Talent logo"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  High Impact Talent
                </h3>
              </div>

              {/* Social links */}
              <div className="flex space-x-6">
                <a
                  href="https://www.linkedin.com/company/highimpacttalent/"
                  className="text-gray-300 hover:text-white transition duration-300"
                  aria-label="Visit our LinkedIn page"
                >
                  <Linkedin size={24} />
                </a>
                <button
                  onClick={openWhatsApp}
                  className="text-gray-300 hover:text-white transition duration-300"
                  aria-label="Contact us on WhatsApp"
                >
                  <WhatsApp sx={{ fontSize: 24 }} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href =
                      "mailto:highimpacttalentenquiry@gmail.com";
                  }}
                  className="text-gray-300 hover:text-white transition duration-300"
                  aria-label="Email us"
                >
                  <Mail size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* WhatsApp options modal for desktop */}
        {whatsappOptionsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                Contact via WhatsApp
              </h2>
              <p className="mb-6 text-gray-300">Would you like to:</p>
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
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 flex-1"
                >
                  Use Web
                </button>
                <button
                  onClick={closeWhatsAppOptions}
                  className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition duration-300 flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-12">
          <div className="container mx-auto max-w-6xl">
            <div
              className={`text-center transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <div className="inline-block mb-4">
                <div className="px-4 py-1 bg-gradient-to-r from-blue-900 to-green-900 bg-opacity-50 rounded-full text-sm font-medium text-blue-300 border border-blue-800">
                  New approach to hiring
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
                <span className="block">Hiring's broken.</span>
                <span className="block">
                  We're{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    fixing
                  </span>{" "}
                  it.
                </span>
              </h1>

              <h2 className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
                And no, not with more dashboards. We're building High Impact
                Talent—a smarter way to connect ambitious companies with people
                who actually get things done.
              </h2>

              <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-green-500 mx-auto opacity-70"></div>
            </div>
          </div>
        </section>

        {/* Main Content Cards Section */}
        <section className="pb-24 px-6 md:px-12">
          <div className="container mx-auto max-w-6xl">
            <div
              className={`grid md:grid-cols-2 gap-8 lg:gap-12 transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
            >
              {/* Left Card - For Recruiters */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                <div className="relative bg-gray-900 rounded-2xl p-8 md:p-10 h-full flex flex-col">
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-green-500 mb-8"></div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    For recruiters who are tired of long hiring cycles.
                  </h3>

                  <p className="text-lg text-gray-300 mb-6">
                    We've helped startups and conglomerates close strategic
                    roles in record time—with zero fluff and full ownership.
                  </p>

                  <p className="text-lg text-gray-300 mb-8">
                    Let's talk about how we can help you too.
                  </p>

                  <div className="mt-auto">
                    <a
                      href="http://calendly.com/koustubhharidas"
                      className="group inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-900/30 transition duration-300"
                      title="Schedule hiring consult | High Impact Talent"
                      aria-label="Book hiring strategy call"
                    >
                      <span className="mr-2">Book a 30-min call</span>
                      <ArrowRight
                        size={18}
                        className="transform group-hover:translate-x-1 transition-transform duration-300"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Card - For Candidates */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>
                <div className="relative bg-gray-900 rounded-2xl p-8 md:p-10 h-full flex flex-col">
                  <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-green-500 mb-8"></div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    Be the first to know when we go live.
                  </h3>

                  <p className="text-lg text-gray-300 mb-4">
                    No spam. No fluff. Just early access to:
                  </p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">
                        Curated roles from high-growth companies
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">
                        Updates on our launch
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 mr-3 mt-1">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
                      </div>
                      <span className="text-gray-300">
                        Career stuff that's actually useful
                      </span>
                    </li>
                  </ul>

                  <form
                    id="job-alert-newsletter-form"
                    onSubmit={handleSubmit}
                    className="mt-auto"
                  >
                    <div className="relative group mb-4">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="relative w-full px-4 py-4 bg-gray-800 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                        required
                        aria-label="Email for job updates newsletter"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group w-full flex items-center justify-center px-4 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-medium rounded-lg shadow-lg transition duration-300"
                      aria-label="Join job update newsletter"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <span className="mr-2">Subscribe</span>
                          <ChevronRight
                            size={18}
                            className="transform group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-transparent to-gray-900">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  85%
                </p>
                <p className="text-sm text-gray-400">Faster Hiring Process</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  100+
                </p>
                <p className="text-sm text-gray-400">Successful Placements</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  92%
                </p>
                <p className="text-sm text-gray-400">Client Satisfaction</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                  3x
                </p>
                <p className="text-sm text-gray-400">Better Candidate Fit</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 md:px-12 bg-gray-900 border-t border-gray-800">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center">
                  <div className="h-10 w-10 mr-4 relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-green-500 p-0.5">
                    <div className="bg-black h-full w-full rounded-full flex items-center justify-center">
                      <img
                        src={logo}
                        alt="High Impact Talent logo"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    High Impact Talent
                  </h2>
                </div>
              </div>

              <div className="flex space-x-8">
                <a
                  href="https://www.linkedin.com/company/highimpacttalent/"
                  className="text-gray-400 hover:text-white transition duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <button
                  onClick={openWhatsApp}
                  className="text-gray-400 hover:text-white transition duration-300"
                  aria-label="WhatsApp"
                >
                  <WhatsApp sx={{ fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = "mailto:yourmail@gmail.com";
                  }}
                  className="text-gray-400 hover:text-white transition duration-300"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                Built by folks who've been in the trenches—at Bain, BCG, and
                beyond.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                We've seen the process inside-out—and we're rebuilding it from
                scratch.
              </p>
              <div className="h-px w-24 bg-gradient-to-r from-blue-500 to-green-500 mx-auto opacity-30 mb-8"></div>
              <p className="text-gray-500 text-xs">
                © {new Date().getFullYear()} High Impact Talent. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Hidden SEO metadata */}
      <div style={{ display: "none" }}>
        <div itemScope itemType="http://schema.org/Organization">
          <meta itemProp="name" content="High Impact Talent" />
          <meta
            itemProp="description"
            content="We're building a hiring platform that helps companies move faster and candidates find roles that matter."
          />
        </div>
        <meta
          name="title"
          content="High Impact Talent | Smarter & Game-Changing Hiring Platform"
        />
        <meta
          name="description"
          content="We're building a hiring platform that helps companies move faster and candidates find roles that matter. Join the waitlist or schedule a call today."
        />
        <h1>We're building something to change how hiring gets done.</h1>
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
