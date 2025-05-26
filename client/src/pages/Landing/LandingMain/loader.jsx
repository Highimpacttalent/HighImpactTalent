import React, { useState, useEffect, useMemo } from 'react';
import logo from "/logo.jpg";

const tips = [
  {
    icon: "⚡",
    title: "Speed Advantage",
    content: "Apply within 48 hours of posting to boost your chances by 400%"
  },
  {
    icon: "🎯",
    title: "Smart Targeting",
    content: "Quality over quantity - targeted applications win over mass applying"
  },
  {
    icon: "📄",
    title: "Resume Reality",
    content: "Meet 60% of job criteria? That's enough to apply and succeed"
  },
  {
    icon: "🔗",
    title: "Network Power",
    content: "80% of opportunities are never advertised - build your network"
  },
  {
    icon: "⏱️",
    title: "First Impression",
    content: "Recruiters spend only 6 seconds on your resume - make them count"
  }
];

const HighImpactLoader = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dotAnimation, setDotAnimation] = useState(0);

  const randomTip = useMemo(() => {
    const index = Math.floor(Math.random() * tips.length);
    return tips[index];
  }, []);

  const loadingSteps = [
    "Analyzing your profile...",
    "Matching opportunities...",
    "Optimizing results...",
    "Finalizing experience..."
  ];

  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(0);
      setCurrentStep(0);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 12, 100);
          
          // Update step based on progress
          if (newProgress < 25) setCurrentStep(0);
          else if (newProgress < 50) setCurrentStep(1);
          else if (newProgress < 75) setCurrentStep(2);
          else setCurrentStep(3);
          
          if (newProgress >= 100) {
            clearInterval(progressInterval);
          }
          
          return newProgress;
        });
      }, 150);

      // Dot animation
      const dotInterval = setInterval(() => {
        setDotAnimation(prev => (prev + 1) % 4);
      }, 500);

      return () => {
        clearInterval(progressInterval);
        clearInterval(dotInterval);
      };
    } else {
      setTimeout(() => setIsVisible(false), 400);
    }
  }, [isLoading]);

  if (!isVisible) return null;

  return (
    <>
      {/* Subtle backdrop */}
      <div className={`fixed inset-0 bg-white/80 backdrop-blur-sm z-40 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Main loader container */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${isLoading ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        {/* Premium card design */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 max-w-md w-full mx-4 relative overflow-hidden">
          
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 via-transparent to-purple-600"></div>
            <svg className="absolute top-4 right-4 w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="2" opacity="0.3" />
              <circle cx="50" cy="20" r="2" opacity="0.5" />
              <circle cx="80" cy="20" r="2" opacity="0.3" />
              <circle cx="20" cy="50" r="2" opacity="0.5" />
              <circle cx="50" cy="50" r="2" opacity="0.7" />
              <circle cx="80" cy="50" r="2" opacity="0.5" />
              <circle cx="20" cy="80" r="2" opacity="0.3" />
              <circle cx="50" cy="80" r="2" opacity="0.5" />
              <circle cx="80" cy="80" r="2" opacity="0.3" />
            </svg>
          </div>

          {/* Header with company branding */}
          <div className="text-center mb-8 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <span className="text-white font-bold text-xl"><img src="/logo.jpg" alt="HIT" /></span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
              High Impact Talent
            </h2>
          </div>

          {/* Creative progress visualization */}
          <div className="mb-8">
            {/* Progress bar with gradient */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex justify-between items-center mb-4">
              {loadingSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 scale-110' 
                      : 'bg-gray-200'
                  }`}></div>
                  {index < loadingSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mt-1 transition-all duration-300 ${
                      index < currentStep ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Current step text with animated dots */}
            <div className="text-center">
              <p className="text-gray-700 font-medium">
                {loadingSteps[currentStep]}
                <span className="inline-block w-6 text-left">
                  {'.'.repeat(dotAnimation)}
                </span>
              </p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {Math.round(progress)}%
              </p>
            </div>
          </div>

          {/* Premium tip section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start space-x-4">
              <div className="text-2xl flex-shrink-0 animate-pulse">
                {randomTip.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                  💡 Pro Tip: {randomTip.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {randomTip.content}
                </p>
              </div>
            </div>
          </div>

          {/* Floating elements for premium feel */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/4 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl -z-10 animate-pulse"></div>
      </div>

      {/* Custom styles for smooth animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default HighImpactLoader;