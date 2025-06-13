import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, ExternalLink, Mail, Phone, FileText, Search, Users, Award, MapPin, Calendar, Download } from 'lucide-react';
import { useSelector } from "react-redux";

const RecruitmentChatbot = () => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCount, setSelectedCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock user name - you can replace with actual user data
  const userName = user.recruiterName|| "Recruiter";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseResponse = (responseText) => {
    const candidateBlocks = responseText.split(/\d+\.\s\*\*/).filter(block => block.trim());
    
    return candidateBlocks.map((block, index) => {
      const lines = block.split('\n').filter(line => line.trim());
      
      const name = lines[0]?.replace(/\*\*/g, '').trim() || `Candidate ${index + 1}`;
      const email = lines.find(line => line.includes('Email:'))?.replace('- Email:', '').trim() || 'Not specified';
      const contact = lines.find(line => line.includes('Contact:'))?.replace('- Contact:', '').trim() || 'Not specified';
      const cvUrl = lines.find(line => line.includes('CV URL'))?.match(/https?:\/\/[^\s)]+/)?.[0] || null;
      
      const summaryIndex = lines.findIndex(line => line.includes('Summary:'));
      const summary = summaryIndex !== -1 ? 
        lines.slice(summaryIndex).join(' ').replace('- Summary:', '').trim() : 
        'No summary available';

      return {
        name,
        email,
        contact,
        cvUrl,
        summary
      };
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://highimpacttalent.onrender.com/api-v1/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputValue,
          nCount: selectedCount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.results[0]?.text || 'No candidates found.',
        candidates: data.results[0]?.text ? parseResponse(data.results[0].text) : [],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'I apologize, but I encountered an issue while searching our talent database. Please try again.',
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const PremiumCandidateCard = ({ candidate, index }) => (
    <div className="group relative bg-gradient-to-br from-white to-gray-50/80 border border-gray-200/60 rounded-2xl p-6 mb-4 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm">
      {/* Premium Badge */}
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg">
        #{index + 1}
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{candidate.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4 text-yellow-500" />
              <span>Verified Candidate</span>
            </div>
          </div>
        </div>
        
        {candidate.cvUrl && (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200">
              <Download className="w-4 h-4" />
              Download
            </button>
            <a 
              href={candidate.cvUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FileText className="w-4 h-4" />
              View CV
            </a>
          </div>
        )}
      </div>
      
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-gray-100">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          {candidate.email !== 'Not specified' ? (
            <a href={`mailto:${candidate.email}`} className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              {candidate.email}
            </a>
          ) : (
            <span className="text-gray-500">{candidate.email}</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 bg-white/80 p-3 rounded-xl border border-gray-100">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Phone className="w-4 h-4 text-green-600" />
          </div>
          {candidate.contact !== 'Not specified' ? (
            <a href={`tel:${candidate.contact}`} className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              {candidate.contact}
            </a>
          ) : (
            <span className="text-gray-500">{candidate.contact}</span>
          )}
        </div>
      </div>
      
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 rounded-xl border border-blue-100/50">
        <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Professional Summary
        </h4>
        <p className="text-gray-700 leading-relaxed text-sm">{candidate.summary}</p>
      </div>
    </div>
  );

  const formatMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 underline-offset-2 inline-flex items-center gap-1 transition-colors"
          >
            {part}
            <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">

      {/* Chat Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/60 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-2xl shadow-gray-200/20 overflow-hidden">
          
          {/* Chat Messages */}
          <div className="h-[600px] overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Your AI Talent Partner</h3>
                <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                  Describe your ideal candidate or role requirements, and I'll instantly connect you with top-tier professionals from our exclusive network.
                </p>
                <div className="flex justify-center gap-4 mt-8">
                  <div className="bg-blue-50/80 px-4 py-2 rounded-full text-sm text-blue-700 font-medium">
                    ✨ AI-Powered Matching
                  </div>
                  <div className="bg-green-50/80 px-4 py-2 rounded-full text-sm text-green-700 font-medium">
                    🎯 Precision Results
                  </div>
                  <div className="bg-purple-50/80 px-4 py-2 rounded-full text-sm text-purple-700 font-medium">
                    ⚡ Instant Search
                  </div>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'bot' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
                
                <div className={`max-w-4xl ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-2xl p-6 shadow-lg ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white ml-auto shadow-blue-500/20' 
                      : message.error 
                        ? 'bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 shadow-red-200/20' 
                        : 'bg-white/80 backdrop-blur-sm border border-gray-200/60 shadow-gray-200/20'
                  }`}>
                    
                    {message.type === 'bot' && !message.error && (
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 text-lg">High Impact Talent</span>
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                            AI Recruiter
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    
                    {message.candidates && message.candidates.length > 0 ? (
                      <div>
                        <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-green-900">
                              Excellent! I've found {message.candidates.length} premium candidates
                            </p>
                            <p className="text-sm text-green-700">
                              Each candidate has been verified and matches your criteria
                            </p>
                          </div>
                        </div>
                        
                        {message.candidates.map((candidate, index) => (
                          <PremiumCandidateCard key={index} candidate={candidate} index={index} />
                        ))}
                      </div>
                    ) : (
                      <div className={`${message.error ? 'text-red-700' : message.type === 'user' ? 'text-white' : 'text-gray-700'} leading-relaxed`}>
                        {formatMessageContent(message.content)}
                      </div>
                    )}
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Analyzing your requirements</p>
                      <p className="text-sm text-gray-600">Searching through our premium talent database...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Premium Input Area */}
          <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm border-t border-gray-200/60 p-6">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Results Count:</span>
                  </div>
                  <select
                    value={selectedCount}
                    onChange={(e) => setSelectedCount(Number(e.target.value))}
                    className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all"
                  >
                    {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map(num => (
                      <option key={num} value={num}>{num} candidates</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your ideal candidate... (e.g., 'Senior React developer with 5+ years experience in fintech')"
                    className="w-full p-4 pr-16 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all bg-white/80 backdrop-blur-sm text-gray-900 placeholder-gray-500"
                    rows="3"
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    Press Enter to send
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentChatbot;