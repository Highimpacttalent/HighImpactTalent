import React, { useState } from "react";
import {
  TrendingUp,
  Brain,
  Users,
  BarChart3,
  CheckCircle,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";

const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://highimpacttalent.onrender.com/api-v1/waitlist/waitlist",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
      } else if (res.status === 409) {
        setError("You're already on the waitlist.");
      } else {
        setError(
          "We're experiencing a huge traffic surge currently. Please try again a little later."
        );
      }
    } catch (err) {
      setError(
        "We're experiencing a huge traffic surge currently. Please try again a little later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Executive-Level Opportunities",
      desc: "Curated roles that define the next chapter of your career",
    },
    {
      icon: <Brain className="w-6 h-6 text-blue-600" />,
      title: "Precision Matching",
      desc: "AI-driven selection ensures only the most qualified reach decision makers",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Direct Headhunter Access",
      desc: "Immediate visibility to industry-leading talent acquisition teams",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "Cultural Intelligence",
      desc: "Comprehensive insights beyond traditional application metrics",
    },
  ];

  const achievements = [
    { metric: "85%", label: "Executive placement success rate" },
    { metric: "3.2x", label: "Average compensation increase" },
    { metric: "21 days", label: "Average time to senior offer" },
    { metric: "50+", label: "Partner companies globally" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-3xl p-10 shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1
                className="text-3xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                Application Confirmed
              </h1>
              <p
                className="text-lg text-gray-600 leading-relaxed mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                You've secured priority positioning. We'll notify you
                immediately when exclusive access becomes available.
              </p>
              <div className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-full font-semibold">
                <span
                  style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 700 }}
                >
                  Added to Priority Queue
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section with Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start py-12">
          {/* Left Content */}
          <div className="space-y-8 lg:pt-8">
            <div className="space-y-6">
              <div className="flex items-center w-52 space-x-3 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-200">
                <Clock className="w-4 h-4" />
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Beta Access Closed
                </span>
              </div>

              <h1
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                The career acceleration platform is
                <span
                  className="text-blue-600 block"
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 400,
                    marginTop: 2,
                  }}
                >
                  temporarily closed
                </span>
              </h1>

              <p
                className="text-xl text-gray-700 leading-relaxed"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Our elite cohort of 100 senior professionals is currently
                experiencing unprecedented career growth through our AI-powered
                executive placement platform.
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3
                className="text-lg font-semibold text-gray-900 mb-4"
                style={{ fontFamily: "Satoshi, sans-serif" }}
              >
                What our beta members are accessing:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "Exclusive C-Suite Opportunities",
                  "AI-Powered Executive Matching",
                  "Direct Headhunter Pipeline",
                  "Comprehensive Culture Analytics",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                    <span
                      className="text-gray-700 font-medium"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form - Positioned Higher */}
          <div className="lg:pt-4">
            <div className="bg-white rounded-3xl p-8 shadow-[0_12px_50px_rgba(0,0,0,0.15)] border border-gray-200 sticky top-24">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-100">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2
                  className="text-2xl font-bold text-gray-900 mb-3"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  Join Elite Waitlist
                </h2>
                <p
                  className="text-gray-600 text-lg"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Secure priority access to executive opportunities
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold text-gray-700 block"
                    style={{ fontFamily: "Satoshi, sans-serif" }}
                  >
                    Professional Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-400 bg-gray-50 focus:bg-white"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>

                {error && (
                  <div
                    className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Secure Priority Access</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-sm text-gray-600">
                    <span style={{ fontFamily: "Poppins, sans-serif" }}>
                      Join a growing waitlist of top professionals.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl my-16">
          <div className="text-center mb-12">
            <h3
              className="text-3xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Platform Performance Metrics
            </h3>
            <p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Data-driven results from our exclusive professional network
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 px-8">
            {achievements.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-6 shadow-lg"
              >
                <div
                  className="text-4xl font-bold text-blue-600 mb-2"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {stat.metric}
                </div>
                <p
                  className="text-gray-600 text-sm leading-relaxed"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h3
              className="text-4xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              Why Industry Leaders Choose Our Platform
            </h3>
            <p
              className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              We don't just connect professionals to opportunities. We architect
              strategic career transitions through advanced technology and
              exclusive industry partnerships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 rounded-2xl flex items-center justify-center mb-6 transition-colors border border-blue-100">
                  {feature.icon}
                </div>
                <h4
                  className="text-xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Satoshi, sans-serif" }}
                >
                  {feature.title}
                </h4>
                <p
                  className="text-gray-600 leading-relaxed"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl text-white text-center">
          <div className="max-w-4xl mx-auto px-8">
            <blockquote
              className="text-2xl font-light italic mb-8 leading-relaxed"
              style={{ fontFamily: "Satoshi, sans-serif", fontWeight: 700 }}
            >
              "The distinction between a position and a transformative career
              opportunity often lies in the intelligence of the platform that
              connects them."
            </blockquote>
            <div
              className="text-blue-200"
              style={{ fontFamily: "Satoshi, sans-serif" }}
            >
              — Career Strategy Philosophy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
