import Navbar from "@/components/navbar";
import PageHeader from "@/components/page-header";
import TestimonialsSection from "@/components/testimonials-section";
import Footer from "@/components/footer";

export const metadata = {
  title: "Testimonials | HatBrain Solutions",
  description: "Read what our clients say about our services and solutions.",
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section with Islamic Pattern */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        {/* Islamic Pattern Background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="testimonials-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M50,10 Q60,10 65,20 Q70,30 65,40 Q60,50 50,50 Q40,50 35,40 Q30,30 35,20 Q40,10 50,10 Z" 
                      fill="none" stroke="#D4A017" strokeWidth="1.5"/>
                <path d="M50,50 Q60,50 65,60 Q70,70 65,80 Q60,90 50,90 Q40,90 35,80 Q30,70 35,60 Q40,50 50,50 Z" 
                      fill="none" stroke="#D4A017" strokeWidth="1.5"/>
                <circle cx="50" cy="50" r="3" fill="#D4A017" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonials-pattern)" />
          </svg>
        </div>
        {/* Yellow Accent - Right Side */}
        {/* <div className="absolute right-0 top-1/4 w-2 h-1/2 bg-gradient-to-b from-[#E6B325] to-[#D4A017]" /> */}

        {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Student <span className="text-[#E6B325]">Reviews</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover what our students have to say about their Quran learning journey with us
          </p>
        </div> */}
      </section>
      
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
