"use client";
import Image from "next/image";
import { Mail, Github, Linkedin, Facebook, Globe } from "lucide-react";
import { fa } from "zod/v4/locales";

export default function AboutPage() {
    const team = [
        {
            name: "Minhajul Islam Miraz",
            role: "Backend Developer",
            image: "miraz.jpg",
            bio: "Passionate about scalable architectures and cloud technologies. Loves solving complex problems with elegant solutions.",
            skills: ["Node.js", "Python", "AWS", "MongoDB"],
            social: {
                linkedin: "https://www.linkedin.com/in/minhajul-islam-miraz/",
                github: "https://github.com/Minhaz-miraz",
                facebook: "",
                mail: "mailto:minhajulmiraz28@gmail.com",
                website: "https://minhajul-islam-miraz.web.app",
            }
        },
        {
            name: "Shah Newaz",
            role: "Frontend Developer",
            image: "newaz.jpg",
            bio: "Crafting beautiful and responsive user experiences. Passionate about React and modern web technologies.",
            skills: ["React", "TypeScript", "Next.js", "Tailwind"],
            social: {
                linkedin: "https://www.linkedin.com/in/md-shah-newaz001/",
                github: "https://github.com/shahnewaz5646455",
                facebook: "https://www.facebook.com/muhammad.shahnewaz.31",
                mail: "mailto:shahnewaz794@gmail.com",
                website: "",
            }
        },
        {
            name: "Sohanur Rahman",
            role: "UI/UX Designer",
            image: "sohanur.jpg",
            bio: "Transforming ideas into intuitive and engaging designs. Focused on user-centered design principles.",
            skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
            social: {
                linkedin: "https://www.linkedin.com/in/sohanurrahman007/",
                github: "https://github.com/SohanurRahman007",
                facebook: "https://www.facebook.com/profile.php?id=100080957303185",
                mail: "mailto:sohanuractive007@gmail.com",
                website: "https://scared-effect.surge.sh/",
            }
        },
        {
            name: "Rubaid Islam",
            role: "Fullstack Developer",
            image: "rubaid.jpg",
            bio: "Bridging frontend and backend with seamless integration. Loves building end-to-end solutions.",
            skills: ["React", "Node.js", "PostgreSQL", "Docker"],
            social: {
                linkedin: "https://www.linkedin.com/in/rubaid07/",
                github: "https://github.com/Rubaid07",
                facebook: "https://www.facebook.com/rubaid.rahman.589",
                mail: "mailto:mohammadrubaid07@gmail.com",
                website: "https://rubaidislam07.web.app/",
            }
        },
        {
            name: "Moinul Islam Umair",
            role: "Project Manager",
            image: "moinul.jpg",
            bio: "Ensuring projects deliver value on time and within scope. Expert in agile methodologies.",
            skills: ["Agile", "Scrum", "JIRA", "Team Leadership"],
            social: {
                linkedin: "https://www.linkedin.com/in/moinul505/",
                github: "https://github.com/Umair505",
                facebook: "https://www.facebook.com/moinul.islam.umair.505",
                mail: "mailto:moinuli359@gmail.com",
                website: "https://moinul-islam-umair-portfolio.netlify.app/",
            }
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900/20 text-gray-800 dark:text-gray-200">
            {/* Team Section */}
            <section id="team" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Meet <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Our Team</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            A diverse group of talented individuals united by passion for innovation and excellence
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 border border-gray-100 dark:border-gray-700"
                            >
                                {/* Gradient Border Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                                <div className="relative z-10">
                                    {/* Avatar */}
                                    <div className="relative w-32 h-32 mx-auto mb-6">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                                        <div className="relative rounded-full p-1 bg-gradient-to-r from-indigo-500 to-purple-500">
                                            <div className="rounded-full bg-white dark:bg-gray-800 p-1">
                                                <Image
                                                    src={`/${member.image}`}
                                                    alt={member.name}
                                                    width={120}
                                                    height={120}
                                                    className="rounded-full object-cover w-full h-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <h3 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
                                        {member.name}
                                    </h3>
                                    <p className="text-indigo-600 dark:text-indigo-400 text-center font-semibold mb-4">
                                        {member.role}
                                    </p>

                                    {/* Bio */}
                                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm leading-relaxed mb-6">
                                        {member.bio}
                                    </p>

                                    {/* Skills */}
                                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                                        {member.skills.map((skill, skillIndex) => (
                                            <span
                                                key={skillIndex}
                                                className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Social Links */}
                                    <div className="flex justify-center space-x-3">
                                        <a
                                            href={member.social.linkedin}
                                            target="_blank"
                                            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                        <a
                                            href={member.social.github}
                                            target="_blank"
                                            className="p-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                        <a
                                            href={member.social.facebook}
                                            target="_blank"
                                            className="p-3 bg-gradient-to-r from-sky-700 to-blue-500 text-white rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                        <a
                                            href={member.social.mail}
                                            className="p-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Mail className="w-5 h-5" />
                                        </a>
                                        <a
                                            href={member.social.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg hover:shadow-xl"
                                        >
                                            <Globe className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}