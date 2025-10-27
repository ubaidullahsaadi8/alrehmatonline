"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppFloat() {
  const [isHovered, setIsHovered] = useState(false);
  const phoneNumber = "923248335750"; // WhatsApp number without + or spaces
  const message = "Hello! I'm interested in learning Quran online.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Chat on WhatsApp"
    >
      {/* Pulsing Ring Animation */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75"></div>
      
      {/* Main Button */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full shadow-2xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 animate-bounce-slow">
        {/* WhatsApp Icon */}
        <MessageCircle className="w-8 h-8 text-white" fill="white" />
        
        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">1</span>
        </div>
      </div>

      {/* Tooltip */}
      <div className={`absolute right-20 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
      }`}>
        <p className="text-sm font-semibold text-gray-800">Chat with us!</p>
        <p className="text-xs text-gray-600">We're online</p>
        {/* Arrow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
          <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </a>
  );
}
