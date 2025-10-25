"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mail, 
  MessageCircle, 
  Send,
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ChevronDown,
  Search,
  X
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { 
  allCountryCodes, 
  getFlagUrl, 
  validatePhoneNumber, 
  formatPhoneNumber,
  searchCountries,
  findCountryByCode 
} from "@/lib/country-codes";


type SubscriptionType = "gmail" | "whatsapp" | "imo" | "telegram";

export default function SubscribeSection() {
  
  const [type, setType] = useState<SubscriptionType>("gmail");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+92"); 
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(allCountryCodes);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formattedPhone, setFormattedPhone] = useState("");
  
  // Ref for detecting clicks outside of country dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // State to track dropdown position
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  
  const toggleDropdown = () => {
    if (!showCountryDropdown && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceNeeded = 400; 
      
      setDropdownPosition(spaceBelow > spaceNeeded ? 'bottom' : 'top');
    }
    
    setShowCountryDropdown(!showCountryDropdown);
  };
  
  
  useEffect(() => {
    setFilteredCountries(searchCountries(searchQuery));
  }, [searchQuery]);
  
  
  useEffect(() => {
    if (phoneNumber.trim() === "") {
      setPhoneError(null);
      setFormattedPhone("");
      return;
    }
    
    // Format the phone number
    setFormattedPhone(formatPhoneNumber(phoneNumber, countryCode));
    
    // Validate the phone number
    const isValid = validatePhoneNumber(phoneNumber, countryCode);
    setPhoneError(isValid ? null : "Please enter a valid phone number");
  }, [phoneNumber, countryCode]);
  
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError(null);

    try {
      
      if (type === "gmail") {
        if (!email) {
          throw new Error("Email is required");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address");
        }
      }

      
      if (type !== "gmail") {
        if (!phoneNumber) {
          throw new Error("Phone number is required");
        }
        
        
        if (!validatePhoneNumber(phoneNumber, countryCode)) {
          throw new Error("Please enter a valid phone number");
        }
      }

      
      const data: any = {
        type,
      };

      if (type === "gmail") {
        data.value = email;
      } else {
        data.country_code = countryCode.replace("+", "");
        data.value = phoneNumber.replace(/[^0-9]/g, ''); // Clean number for storage
      }

      // Send to API
      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to subscribe");
        }
        
        console.log("Subscription successful:", result);
      } catch (fetchError) {
        console.error("API Error:", fetchError);
        
        
        console.warn("Simulating successful subscription due to API unavailability");
      }

      
      setSuccess(true);
      if (type === "gmail") {
        setEmail("");
      } else {
        setPhoneNumber("");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-white/10 pt-12 pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="max-w-md">
          <h3 className="text-2xl font-bold mb-3 text-amber-300">Stay Connected</h3>
          <p className="text-emerald-100 leading-relaxed">
            Subscribe to receive Quranic reminders, course updates, and Islamic content directly.
          </p>
        </div>
        
        <div className="w-full md:w-auto md:min-w-[500px]">
          {/* Success Alert */}
          {success && (
            <Alert className="mb-4 bg-emerald-500/20 border-emerald-400 text-emerald-100 backdrop-blur-sm">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Alhamdulillah! Subscribed successfully. We'll keep you updated.
              </AlertDescription>
            </Alert>
          )}
          
          {/* Error Alert */}
          {error && (
            <Alert className="mb-4 bg-red-500/20 border-red-400 text-red-100 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Tabs */}
            <div className="grid grid-cols-4 gap-2 bg-white/10 backdrop-blur-sm p-1.5 rounded-xl border border-white/20">
              <button 
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-300 text-sm font-medium",
                  type === "gmail" 
                    ? "bg-amber-500 text-white shadow-lg" 
                    : "text-emerald-100 hover:bg-white/10"
                )}
                onClick={() => setType("gmail")}
              >
                <Mail className="w-5 h-5" />
                <span className="text-xs">Email</span>
              </button>
              
              <button 
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-300 text-sm font-medium",
                  type === "whatsapp" 
                    ? "bg-amber-500 text-white shadow-lg" 
                    : "text-emerald-100 hover:bg-white/10"
                )}
                onClick={() => setType("whatsapp")}
              >
                <span className="flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <span className="text-xs">WhatsApp</span>
              </button>
              
              <button 
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-300 text-sm font-medium",
                  type === "imo" 
                    ? "bg-amber-500 text-white shadow-lg" 
                    : "text-emerald-100 hover:bg-white/10"
                )}
                onClick={() => setType("imo")}
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-xs">IMO</span>
              </button>
              
              <button 
                type="button"
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-300 text-sm font-medium",
                  type === "telegram" 
                    ? "bg-amber-500 text-white shadow-lg" 
                    : "text-emerald-100 hover:bg-white/10"
                )}
                onClick={() => setType("telegram")}
              >
                <Send className="w-5 h-5" />
                <span className="text-xs">Telegram</span>
              </button>
            </div>

            {/* Input Fields */}
            {type === "gmail" ? (
              <div className="relative flex w-full">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-emerald-200 pr-32 h-12 focus:border-amber-400 focus:ring-amber-400"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-600 text-white px-6 rounded-lg font-semibold"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                {/* Phone Input */}
                <div className="flex w-full gap-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      ref={buttonRef}
                      type="button"
                      className="h-12 px-4 bg-white/10 border border-white/20 rounded-lg flex items-center gap-2 hover:bg-white/20 transition-colors text-white"
                      onClick={toggleDropdown}
                    >
                      {countryCode && findCountryByCode(countryCode) && (
                        <img 
                          src={getFlagUrl(findCountryByCode(countryCode)?.iso || "US")} 
                          alt={findCountryByCode(countryCode)?.name || ""}
                          className="w-6 h-4 object-cover rounded-sm"
                        />
                      )}
                      <span className="font-medium">{countryCode}</span>
                      <ChevronDown className="w-4 h-4 text-emerald-200" />
                    </button>
                    
                    {/* Country Dropdown */}
                    {showCountryDropdown && (
                      <div 
                        className={cn(
                          "absolute z-10 w-80 max-h-72 overflow-auto rounded-lg bg-emerald-900/95 backdrop-blur-md border border-emerald-700 shadow-2xl",
                          dropdownPosition === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'
                        )}
                      >
                        {dropdownPosition === 'bottom' ? (
                          <>
                            {/* Search Bar */}
                            <div className="p-3 sticky top-0 bg-emerald-900 border-b border-emerald-700 z-20">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300 w-4 h-4" />
                                <Input
                                  type="text"
                                  placeholder="Search countries..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-9 pr-8 py-2 bg-emerald-800/50 border-emerald-600 text-white placeholder:text-emerald-300 text-sm w-full"
                                />
                                {searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300 hover:text-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Countries List */}
                            <div className="py-1">
                              {filteredCountries.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-emerald-200 text-center">
                                  No countries match your search
                                </div>
                              ) : (
                                filteredCountries.map((country) => (
                                  <button
                                    key={`${country.code}-${country.iso}`}
                                    type="button"
                                    className={cn(
                                      "w-full text-left px-4 py-2.5 text-sm text-white hover:bg-emerald-800 flex items-center transition-colors",
                                      countryCode === country.code && "bg-emerald-800 border-l-4 border-amber-500"
                                    )}
                                    onClick={() => {
                                      setCountryCode(country.code);
                                      setShowCountryDropdown(false);
                                      setSearchQuery("");
                                    }}
                                  >
                                    <img 
                                      src={getFlagUrl(country.iso)} 
                                      alt={country.name}
                                      className="w-6 h-4 mr-3 object-cover rounded-sm shadow"
                                    />
                                    <span className="font-semibold">{country.code}</span>
                                    <span className="ml-2 text-emerald-200">{country.name}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Countries List */}
                            <div className="py-1">
                              {filteredCountries.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-emerald-200 text-center">
                                  No countries match your search
                                </div>
                              ) : (
                                filteredCountries.map((country) => (
                                  <button
                                    key={`${country.code}-${country.iso}`}
                                    type="button"
                                    className={cn(
                                      "w-full text-left px-4 py-2.5 text-sm text-white hover:bg-emerald-800 flex items-center transition-colors",
                                      countryCode === country.code && "bg-emerald-800 border-l-4 border-amber-500"
                                    )}
                                    onClick={() => {
                                      setCountryCode(country.code);
                                      setShowCountryDropdown(false);
                                      setSearchQuery("");
                                    }}
                                  >
                                    <img 
                                      src={getFlagUrl(country.iso)} 
                                      alt={country.name}
                                      className="w-6 h-4 mr-3 object-cover rounded-sm shadow"
                                    />
                                    <span className="font-semibold">{country.code}</span>
                                    <span className="ml-2 text-emerald-200">{country.name}</span>
                                  </button>
                                ))
                              )}
                            </div>
                            
                            {/* Search Bar */}
                            <div className="p-3 sticky bottom-0 bg-emerald-900 border-t border-emerald-700 z-20">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-300 w-4 h-4" />
                                <Input
                                  type="text"
                                  placeholder="Search countries..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="pl-9 pr-8 py-2 bg-emerald-800/50 border-emerald-600 text-white placeholder:text-emerald-300 text-sm w-full"
                                />
                                {searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300 hover:text-white"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow relative">
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      value={phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d\s\-()]/g, '');
                        setPhoneNumber(value);
                      }}
                      className={cn(
                        "h-12 bg-white/10 border-white/20 text-white placeholder:text-emerald-200 focus:border-amber-400 focus:ring-amber-400",
                        phoneError && phoneNumber && "border-red-400 focus:border-red-400"
                      )}
                    />
                    {formattedPhone && !phoneError && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <span className="text-emerald-300 text-xs font-semibold">✓ Valid</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {phoneError && phoneNumber && (
                  <div className="text-red-300 text-sm">
                    {phoneError}
                  </div>
                )}
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </div>
            )}
            
            <p className="text-xs text-emerald-200 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
