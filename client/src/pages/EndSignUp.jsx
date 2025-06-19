import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecruiterRedirectPage = () => {
  const navigate = useNavigate();
  // Actual user data structure from your backend
  const userData = {
    _id: "681dd8db92a42414403477a6",
    name: "Test",
    recruiterName: "Test",
    mobileNumber: "8374026569",
    email: "test@gmail.com",
    copmanyType: "company", // Note: keeping original field name as in your data
    accountType: "recruiter",
    profileUrl: "https://logonoid.com/images/bain-and-company-logo.png",
    jobPosts: [
      "681de47905bca925bd9e0af6",
      "682357b0c6489b597389ede9",
      "6823d7a68f07f04a5cea5d4f",
      "685167c54ceb0c8accfa68f4",
    ],
    location: "", // Can be empty string
    designation: "", // May not exist
    organizationType: "", // May not exist
    numberOfEmployees: "", // May not exist
  };

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStartExploring = () => {
    navigate("/upload-a-job")
  };

  const getPersonalizationInsight = () => {
    const jobCount = userData.jobPosts?.length || 0;
    const companyType = userData.copmanyType || "organization";

    if (jobCount >= 4) return "advanced recruitment strategies";
    if (jobCount >= 2) return "scaling talent acquisition";
    return "strategic hiring solutions";
  };

  const getAccountDisplayName = () => {
    return userData.accountType === "recruiter"
      ? "Recruiter"
      : userData.accountType;
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Satoshi:wght@300;400;500;600;700;800&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body,
        html {
          font-family: "Satoshi", -apple-system, BlinkMacSystemFont, sans-serif;
          background: #ffffff;
          color: #0f172a;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .container {
          min-height: 100vh;
          background: #ffffff;
        }

        .header {
          border-bottom: 1px solid #f1f5f9;
          padding: 32px 0;
        }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }

        .user-info h2 {
          font-family: "Poppins", sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 2px;
          letter-spacing: -0.01em;
        }

        .user-meta {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
        }

        .status-badge {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(30, 41, 59, 0.15);
        }

        .main-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 80px 32px;
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 120px;
          align-items: center;
        }

        .content-section {
          max-width: 600px;
        }

        .hero-title {
          font-family: "Poppins", sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.1;
          color: #0f172a;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: 18px;
          color: #475569;
          font-weight: 400;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .personalized-message {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 40px;
          position: relative;
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .founder-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .founder-info .name {
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 2px;
        }

        .founder-info .title {
          font-size: 13px;
          color: #64748b;
        }

        .message-text {
          font-size: 16px;
          line-height: 1.7;
          color: #334155;
          font-style: italic;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 48px;
        }

        .metric-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: default;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          border-color: #cbd5e1;
        }

        .metric-number {
          font-family: "Poppins", sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1;
        }

        .metric-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cta-section {
          margin-bottom: 32px;
        }

        .cta-button {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          border: none;
          padding: 18px 32px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(30, 41, 59, 0.2);
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 41, 59, 0.3);
        }

        .trust-indicators {
          margin-top: 24px;
          font-size: 14px;
          color: #64748b;
          display: flex;
          flex-wrap: wrap;
          gap: 32px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .visual-section {
          position: relative;
        }

        .dashboard-mockup {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          position: relative;
          overflow: hidden;
        }

        .mockup-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }

        .traffic-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .red {
          background: #ef4444;
        }
        .yellow {
          background: #f59e0b;
        }
        .green {
          background: #10b981;
        }

        .chart-container {
          height: 200px;
          background: #f8fafc;
          border-radius: 16px;
          display: flex;
          align-items: end;
          justify-content: center;
          padding: 24px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .chart-bars {
          display: flex;
          align-items: end;
          gap: 8px;
          height: 100%;
        }

        .bar {
          width: 24px;
          background: linear-gradient(to top, #1e293b, #334155);
          border-radius: 4px 4px 0 0;
          animation: growBar 1.5s ease-out forwards;
          animation-delay: calc(var(--index) * 0.1s);
          opacity: 0.9;
        }

        @keyframes growBar {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: var(--height);
            opacity: 0.9;
          }
        }

        .stats-overview {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .stat-item {
          background: #f8fafc;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }

        .stat-value {
          font-family: "Poppins", sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .stat-description {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-content {
            grid-template-columns: 1fr;
            gap: 60px;
            padding: 60px 24px;
          }

          .hero-title {
            font-size: 40px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .header-inner {
            padding: 0 24px;
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .hero-title {
            font-size: 32px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .trust-indicators {
            flex-direction: column;
            gap: 16px;
          }

          .dashboard-mockup {
            padding: 24px;
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding: 40px 16px;
          }

          .header-inner {
            padding: 0 16px;
          }

          .user-profile {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .avatar {
            width: 48px;
            height: 48px;
          }

          .hero-title {
            font-size: 28px;
          }

          .personalized-message {
            padding: 24px;
          }

          .cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="container">
        <header className="header">
          <div className="header-inner">
            <div className="user-profile">
              <img
                src={userData.profileUrl}
                alt={`${userData.recruiterName} profile`}
                className="avatar"
              />
              <div className="user-info">
                <h2>Welcome, {userData.recruiterName}</h2>
                <div className="user-meta">
                  {userData.name}
                  {userData.location && ` • ${userData.location}`}
                </div>
              </div>
            </div>
            <div className="status-badge">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              {getAccountDisplayName()} Account
            </div>
          </div>
        </header>

        <main className={`main-content ${isLoaded ? "fade-in" : ""}`}>
          <div className="content-section">
            <h1 className="hero-title">
              Elite talent acquisition for modern recruiters
            </h1>
            <p className="hero-subtitle">
              Streamline your {getPersonalizationInsight()} with precision
              matching, enterprise-grade security, and access to our global
              network of top-tier professionals.
            </p>

            <div className="personalized-message">
              <div className="message-header">
                <div className="founder-avatar">K</div>
                <div className="founder-info">
                  <div className="name">Koustubh</div>
                  <div className="title">Founder & CEO</div>
                </div>
              </div>
              <p className="message-text">
                "{userData.recruiterName}, welcome to the inner circle of
                recruitment visionaries. At {userData.name}, you're not just
                hiring — you're curating excellence.
                {userData.jobPosts?.length > 0
                  ? ` With ${userData.jobPosts.length} stellar openings already launched, it's clear you're not here to play small.`
                  : ` You've got the spark — the kind that rewrites the playbook of talent acquisition.`}
                This platform isn’t built for everyone — it’s built for the
                bold, the precise, and those who know that great teams build
                legendary companies. Let’s set a new gold standard, together."
              </p>
            </div>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-number">2.5K+</div>
                <div className="metric-label">Active Professionals</div>
              </div>
              <div className="metric-card">
                <div className="metric-number">85%</div>
                <div className="metric-label">Match Accuracy</div>
              </div>
              <div className="metric-card">
                <div className="metric-number">12 Days</div>
                <div className="metric-label">Avg. Time to Hire</div>
              </div>
            </div>

            <div className="cta-section">
              <button className="cta-button" onClick={handleStartExploring}>
                <span>Post Job</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" />
                </svg>
              </button>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
                SOC 2 Compliant
              </div>
              <div className="trust-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                </svg>
                24/7 Enterprise Support
              </div>
              <div className="trust-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z" />
                </svg>
                99.9% Platform Uptime
              </div>
            </div>
          </div>

          <div className="visual-section">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="traffic-light red"></div>
                <div className="traffic-light yellow"></div>
                <div className="traffic-light green"></div>
              </div>

              <div className="chart-container">
                <div className="chart-bars">
                  <div
                    className="bar"
                    style={{ "--height": "60%", "--index": 0 }}
                  ></div>
                  <div
                    className="bar"
                    style={{ "--height": "85%", "--index": 1 }}
                  ></div>
                  <div
                    className="bar"
                    style={{ "--height": "70%", "--index": 2 }}
                  ></div>
                  <div
                    className="bar"
                    style={{ "--height": "95%", "--index": 3 }}
                  ></div>
                  <div
                    className="bar"
                    style={{ "--height": "75%", "--index": 4 }}
                  ></div>
                  <div
                    className="bar"
                    style={{ "--height": "90%", "--index": 5 }}
                  ></div>
                  <div
                    className="bar"
                    style={{ "--height": "80%", "--index": 6 }}
                  ></div>
                </div>
              </div>

              <div className="stats-overview">
                <div className="stat-item">
                  <div className="stat-value">75+</div>
                  <div className="stat-description">Careers Launched</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">98%</div>
                  <div className="stat-description">
                    Positive Hiring Experiences
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">50+</div>
                  <div className="stat-description">
                    Recruiting Brands Onboarded
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">∞</div>
                  <div className="stat-description">Possibilities Ahead</div>
                </div>
              </div>
            </div>

            <p className="mockup-subtext text-center mt-4 text-gray-500 italic">
              This isn't just a dashboard. It's a glimpse into the movement
              you're now a part of.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default RecruiterRedirectPage;
