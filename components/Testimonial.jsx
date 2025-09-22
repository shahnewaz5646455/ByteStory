"use client";

import React from "react";
import { Star, Quote, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Shah Newaz",
    role: "Content Creator",
    avatar: "newaz.jpg",
    content: "This platform has completely transformed my blogging workflow. The AI suggestions are incredibly accurate and save me hours of research time.",
    rating: 5
  },
  {
    id: 2,
    name: "Minhajul Islam Miraz",
    role: "Marketing Director",
    avatar: "miraz.jpg",
    content: "The SEO optimization tools are game-changing. Our organic traffic increased by 157% in just three months after implementing the recommendations.",
    rating: 5
  },
  {
    id: 3,
    name: "Rubaid Islam",
    role: "Freelance Writer",
    avatar: "rubaid.jpg",
    content: "As a freelance writer, this tool helps me deliver high-quality content to my clients faster than ever. The interface is intuitive and powerful.",
    rating: 5
  },
  {
    id: 4,
    name: "Moinul Islam Umair",
    role: "Startup Founder",
    avatar: "moinul.jpg",
    content: "The perfect balance of AI power and human creativity. It enhances my writing without making it sound robotic or artificial.",
    rating: 5
  },
  {
    id: 5,
    name: "Sohanur Rahman",
    role: "Blog Manager",
    avatar: "sohanur.jpg",
    content: "Our team's productivity has skyrocketed. We're publishing more content with better quality and less effort. Worth every penny!",
    rating: 5
  },
];

const TestimonialSection = () => {
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <section className="py-20 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Loved by Creators
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Users Say</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of content creators who are transforming their workflow with our AI-powered platform
          </p>
        </div>

        {/* Testimonial Carousel with Swiper */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="mySwiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="px-3 py-4">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-[320px] transform">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        {/* Quote Icon */}
                        <div className="mb-4">
                          <Quote className="h-8 w-8 text-indigo-400 opacity-60" />
                        </div>

                        {/* Content */}
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                          "{testimonial.content}"
                        </p>
                      </div>

                      <div>
                        {/* Rating */}
                        <div className="flex items-center mb-4">
                          {renderStars(testimonial.rating)}
                        </div>

                        {/* Author */}
                        <div className="flex items-center">
                          <Image
                            src={`/${testimonial.avatar}`}
                            alt={testimonial.name}
                            height={48}
                            width={48}
                            className="rounded-full object-cover mr-4"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;