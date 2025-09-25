"use client"
import React, { useState } from 'react';
import { Zap, ArrowRight, Sparkles, Users, Rocket, Star } from 'lucide-react';
import { Meteors } from '@/components/ui/meteors';
import Link from 'next/link';
const userImages = [
    "https://randomuser.me/api/portraits/men/47.jpg",
    "https://randomuser.me/api/portraits/men/50.jpg",
    "https://randomuser.me/api/portraits/men/78.jpg",
];

const Cta = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="mx-auto max-w-7xl px-4 pb-20 py-16">

            <div
                className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-12 text-center border border-indigo-100/50 dark:border-purple-900/30 dark:hover:shadow-purple-900/30 transition-all duration-500 shadow-md overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background Animation Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <Meteors />
                    <div className={`absolute -top-10 -right-10 w-20 h-20 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-xl transition-all duration-700 ${isHovered ? 'scale-150 opacity-60' : 'opacity-40'}`}></div>
                    <div className={`absolute -bottom-10 -left-10 w-24 h-24 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-xl transition-all duration-700 delay-100 ${isHovered ? 'scale-150 opacity-60' : 'opacity-40'}`}></div>
                    <div className={`absolute top-1/2 left-1/4 w-16 h-16 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-lg transition-all duration-700 delay-200 ${isHovered ? 'scale-125 opacity-50' : 'opacity-30'}`}></div>
                </div>

                {/* Floating Icons */}
                <Sparkles className={`absolute top-6 left-6 md:left-10 w-8 h-8 text-purple-400 transition-all duration-500 ${isHovered ? 'scale-110 rotate-12' : ''}`} />
                <Zap className={`absolute bottom-6 right-6 md:right-10 w-8 h-8 text-indigo-400 transition-all duration-500 delay-100 ${isHovered ? 'scale-110 -rotate-12' : ''}`} />

                {/* Content */}
                <div className="relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-100 dark:border-indigo-900/50">
                        <Zap className="w-4 h-4" />
                        Join 10,000+ Creators
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl md:text-5xl font-bold pb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        Supercharge Your Content
                    </h2>

                    {/* Subheading */}
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                        Join <span className="font-semibold text-indigo-600 dark:text-indigo-400">10,000+ content creators</span> who are already using our AI tools to save time and create better content.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span>4.9/5 Rating</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4 text-green-500" />
                            <span>10K+ Users</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Rocket className="w-4 h-4 text-purple-500" />
                            <span>7 AI Tools</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-4 justify-center items-center mb-6">
                        <Link href="/login" className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center gap-2 cursor-pointer">
                            <span className="whitespace-nowrap">Get Started Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        No credit card required • Free forever plan • Setup in 2 minutes
                    </p>

                    {/* Testimonial Preview */}
                    <div className="mt-8 flex justify-center">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 max-w-md border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {userImages.map((imageUrl, index) => (
                                        <img
                                            key={index}
                                            src={imageUrl}
                                            alt={`User avatar ${index + 1}`}
                                            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                                        />
                                    ))}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Join creators from
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Google, Microsoft, and 100+ companies
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Cta;