import Navbar from "@/components/navbar"
import HeroSectionStunning from "@/components/hero-section-stunning"
import ThreeStepsSectionStunning from "@/components/three-steps-section-stunning"
import WhyChooseSectionStunning from "@/components/why-choose-section-stunning"
import ServicesSectionStunning from "@/components/services-section-stunning"
import HomeTestimonialsCarousel from "@/components/home-testimonials-carousel"
import Footer from "@/components/footer"

export default function Page() {
  return (
    <div className="bg-white">
      <Navbar />
      {/* Add padding top to account for fixed header with top bar */}
      <div className="pt-[80px]">
        <HeroSectionStunning />
        <ThreeStepsSectionStunning />
        <WhyChooseSectionStunning />
        <ServicesSectionStunning />
        <HomeTestimonialsCarousel />
        <Footer />
      </div>
    </div>
  )
}
