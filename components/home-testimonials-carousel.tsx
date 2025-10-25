"use client";

import { useEffect, useState } from "react";
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

function TestimonialCard({
  testimonial,
  onMouseEnter,
  onMouseLeave,
}: {
  testimonial: Testimonial;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <div
      className="h-full px-2 sm:px-3 pt-6 sm:pt-8 testimonial-card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`bg-white backdrop-blur-sm p-4 sm:p-5 md:p-6 pt-8 sm:pt-9 md:pt-10 rounded-xl sm:rounded-2xl relative transform transition-all duration-500 border-2 ${
          isHovered
            ? "shadow-xl shadow-emerald-500/20 scale-[1.02] border-emerald-300"
            : "shadow-md border-gray-200 hover:shadow-lg"
        } flex flex-col h-full mt-4`}
      >
        {/* Quote Icon */}
        <div className="absolute flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full -top-4 sm:-top-5 -left-2 sm:-left-3 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <Quote className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white" />
        </div>

        {/* Rating Stars */}
        <div className="flex gap-0.5 sm:gap-1 mt-2 sm:mt-3 mb-3 sm:mb-4 md:mb-5">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
          ))}
        </div>

        {/* Testimonial Content */}
        <div className="relative flex-grow mb-3 sm:mb-4">
          <p className="text-sm sm:text-base leading-relaxed text-gray-700">
            "{testimonial.content}"
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-2.5 sm:gap-3 mt-auto">
          <div className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100 p-0.5 border-2 border-emerald-500">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="object-cover w-full h-full rounded-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full font-bold text-emerald-700 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-lg sm:text-xl">
                {testimonial.name[0]}
              </div>
            )}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
            <div className="text-xs sm:text-sm text-emerald-700">{testimonial.role}</div>
            <div className="text-xs text-gray-500">{testimonial.company}</div>
          </div>
        </div>

        {/* Pause Indicator */}
        {isHovered && (
          <div className="absolute flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-emerald-700 rounded-full top-2 sm:top-3 right-2 sm:right-3 bg-emerald-100 border border-emerald-300">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <span>Paused</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeTestimonialsCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
        setTestimonials([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!autoplayEnabled || testimonials.length === 0 || !carouselApi) return;

    const startAutoplay = () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);

      autoplayRef.current = setInterval(() => {
        carouselApi.scrollNext();
      }, 5000);
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplayEnabled, testimonials.length, carouselApi]);

  const pauseAutoplay = () => setAutoplayEnabled(false);
  const resumeAutoplay = () => setAutoplayEnabled(true);

  useEffect(() => {
    if (!carouselApi) return;

    const onScroll = () => {
      if (!carouselApi) return;
      const slideIndex = carouselApi.selectedScrollSnap();
      setCurrentIndex(slideIndex);
    };

    carouselApi.on("select", onScroll);

    return () => {
      carouselApi.off("select", onScroll);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.scrollTo(currentIndex);
  }, [carouselApi, currentIndex]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="py-32 text-center text-gray-400">
        No testimonials available yet.
      </div>
    );
  }

  return (
    <section
      id="testimonials"
      className="bg-gradient-to-b from-white via-emerald-50/30 to-white mt-0 pt-12 sm:pt-14 md:pt-16 lg:pt-20 pb-16 sm:pb-20 md:pb-24 min-h-[600px] sm:min-h-[650px] md:min-h-[720px] relative overflow-hidden"
    >
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="testimonials-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="40"
                cy="40"
                r="30"
                fill="none"
                stroke="#2D7A4F"
                strokeWidth="1"
              />
              <path
                d="M40 10 L70 40 L40 70 L10 40 Z"
                fill="none"
                stroke="#2D7A4F"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonials-pattern)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute rounded-full top-1/4 -left-20 sm:-left-40 w-60 h-60 sm:w-80 sm:h-80 bg-emerald-600/10 filter blur-3xl"></div>
      <div className="absolute rounded-full bottom-1/4 -right-20 sm:-right-40 w-60 h-60 sm:w-80 sm:h-80 bg-teal-600/10 filter blur-3xl"></div>

      <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mx-auto max-w-7xl">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 mx-auto mb-4 sm:mb-5 md:mb-6 rounded-full bg-emerald-100 border border-emerald-200 w-max">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-700 fill-emerald-700" />
          <span className="text-xs sm:text-sm text-emerald-800 font-semibold">
            Student Testimonials
          </span>
        </div>

        <div className="mb-10 sm:mb-12 md:mb-16 text-center">
          <h2
            className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-900"
            style={{ fontFamily: "'Amiri', serif" }}
            dir="rtl"
          >
            شهادات الطلاب
          </h2>
          <h3 className="mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Students Say
            </span>
          </h3>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-600 px-4">
            Hear from our students and parents about their Quran learning
            journey
          </p>
        </div>

        <div
          className="relative mx-auto max-w-7xl"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
        >
          <div className="relative mt-8 sm:mt-10 md:mt-12 carousel-container">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="pt-6 sm:pt-8 -ml-2 md:-ml-4">
                {}
                {Array.from({ length: Math.ceil(testimonials.length / 2) }).map(
                  (_, slideIndex) => (
                    <CarouselItem
                      key={slideIndex}
                      className="pt-4 sm:pt-6 pb-6 sm:pb-8 pl-2 md:pl-4 basis-full lg:basis-full"
                    >
                      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
                        {}
                        {testimonials[slideIndex * 2] && (
                          <TestimonialCard
                            testimonial={testimonials[slideIndex * 2]}
                            onMouseEnter={pauseAutoplay}
                            onMouseLeave={resumeAutoplay}
                          />
                        )}

                        {}
                        {testimonials[slideIndex * 2 + 1] && (
                          <TestimonialCard
                            testimonial={testimonials[slideIndex * 2 + 1]}
                            onMouseEnter={pauseAutoplay}
                            onMouseLeave={resumeAutoplay}
                          />
                        )}
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>

              {/* Navigation Arrows */}
              <div className="absolute flex items-center justify-between -translate-y-1/2 pointer-events-none top-1/2 -left-2 -right-2 sm:-left-3 sm:-right-3 md:-left-6 md:-right-6 lg:-left-8 lg:-right-8">
                <CarouselPrevious
                  className="
      group z-10 translate-y-4 sm:translate-y-6
      !bg-white !border-[#FFB900] !border-2
      text-[#FFB900]
      rounded-full shadow-md
      pointer-events-auto
      transition-all duration-300 ease-out
      hover:scale-110 hover:-translate-x-1 hover:shadow-xl hover:shadow-amber-200/40
      active:-translate-x-1.5
      focus:outline-none focus:ring-2 focus:ring-[#E6B325]/50
      size-9 sm:size-10 md:size-11 lg:size-12
      [&_svg]:transition-transform [&_svg]:duration-300
      hover:[&_svg]:-translate-x-1
    "
                />

                <CarouselNext
                  className="
      group z-10 translate-y-4 sm:translate-y-6
      !bg-white !border-[#FFB900] !border-2
      text-[#FFB900]
      rounded-full shadow-md
      pointer-events-auto
      transition-all duration-300 ease-out
      hover:scale-110 hover:translate-x-1 hover:shadow-xl hover:shadow-amber-200/40
      active:translate-x-1.5
      focus:outline-none focus:ring-2 focus:ring-[#E6B325]/50
      size-9 sm:size-10 md:size-11 lg:size-12
      [&_svg]:transition-transform [&_svg]:duration-300
      hover:[&_svg]:translate-x-1
    "
                />
              </div>
            </Carousel>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-1.5 sm:h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 w-6 sm:w-8"
                      : "bg-gray-300 hover:bg-gray-400 w-1.5 sm:w-2"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
