import { Lock, Smile, Users2, MessageCircle, Shield, Zap } from "lucide-react";
import React from "react";

export default function Dashboard() {
  return (
<div className="relative flex flex-col w-full items-center justify-start h-screen max-w-full overflow-y-auto overflow-x-hidden scrollbar-hide">
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
  .scrollbar-hide {
    -ms-overflow-style: none;      /* Internet Explorer 10+ */
    scrollbar-width: thin;         /* Firefox */
    scrollbar-color: transparent transparent;
  }
  .scrollbar-hide::-webkit-scrollbar {
    width: 6px;                    /* Chrome/Safari/Webkit - Keep thin but visible */
    height: 6px;
  }
  .scrollbar-hide::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }
  .scrollbar-hide::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
  .scrollbar-hide::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
          animation-fill-mode: both;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        /* Mobile optimizations */
        @media (max-width: 640px) {
          .mobile-padding {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
      `}</style>

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 overflow-hidden">
        {/* Floating Elements - Reduced for mobile */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-blue-400/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 bg-purple-400/10 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/3 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-pink-400/10 rounded-full blur-2xl sm:blur-3xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Particles - Fewer on mobile */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${8 + Math.random() * 12}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center animate-fade-in-down">
            <div className="relative mb-4 sm:mb-6">
              <div className="absolute -inset-1 sm:-inset-2 md:-inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg sm:blur-xl md:blur-2xl animate-pulse"></div>
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl sm:shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Users2 className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 leading-tight">
              PeerChat
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600 dark:text-gray-300">
              <div className="w-4 sm:w-6 md:w-8 lg:w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
              <span className="text-xs sm:text-sm font-medium tracking-wider">SECURE MESSAGING</span>
              <div className="w-4 sm:w-6 md:w-8 lg:w-12 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="animate-fade-in-up mobile-padding">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-800 dark:text-white mb-2 sm:mb-3 md:mb-4">
              👋 Welcome to your secure messaging hub
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-full leading-relaxed">
              Connect with friends and family through encrypted conversations. 
              Your privacy is our priority.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-full animate-fade-in-up animation-delay-300 mobile-padding">
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">End-to-End Encrypted</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Your messages are protected with military-grade encryption</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">Lightning Fast</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Real-time messaging with instant delivery</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl sm:rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:transform hover:scale-105 transition-all duration-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg mx-auto sm:mx-0">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm sm:text-base">Rich Messaging</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Share text, images, and more with ease</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center animate-fade-in-up animation-delay-600 mobile-padding">
            <div className="relative inline-block">
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-xl sm:rounded-2xl blur opacity-60"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-6 shadow-lg sm:shadow-xl">
                <p className="text-sm sm:text-base md:text-lg font-medium text-gray-800 dark:text-white mb-2">
                  Ready to start chatting?
                </p>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                  Select a chat from the sidebar or <span className="text-blue-500 font-semibold">add a friend</span> to begin your conversation
                </p>
                <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  <span>All conversations are private and secure</span>
                </div>
              </div>
            </div>
          </div>

          {/* Animated Chat Bubble */}
          <div className="animate-bounce-slow pb-4">
            <div className="relative">
              <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-lg"></div>
              <div className="relative text-2xl sm:text-3xl md:text-4xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-3 sm:p-4 shadow-lg">
                💬
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}