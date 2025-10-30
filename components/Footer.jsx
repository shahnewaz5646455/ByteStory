import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Lightbulb, Heart, Github } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="flex flex-col lg:flex-row justify-between gap-8">

            {/* Brand Section */}
            <div className="max-w-sm">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-full flex items-center justify-center 
                      bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg hover:shadow-xl transition-shadow">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">
                  ByteStory
                </span>
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Share your stories, connect with readers, and build your writing community.
                The perfect platform for bloggers and content creators.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <p className="font-medium text-gray-700 dark:text-gray-200">Stay updated</p>
                <div className="">
                  <form
                    action="https://app.us1.list-manage.com/subscribe/post?u=27af9c89a5678128dfd200ebe&amp;id=5e8b6367eb&amp;f_id=0013d5e4f0"
                    method="post" target="_blank"
                  >
                    <div className="flex gap-2">
                      <input
                        type="email"
                        name="EMAIL"
                        placeholder="Enter your email"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />

                      <div
                        className="absolute -left-[5000px]"
                        aria-hidden="true"
                      >
                        <input
                          type="text"
                          name="b_27af9c89a5678128dfd200ebe_5e8b6367eb"
                          tabIndex={-1}
                          defaultValue=""
                          autoComplete="off"
                        />
                      </div>

                      <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white 
                           rounded-lg hover:shadow-lg transition duration-200 flex items-center gap-1 cursor-pointer hover:from-indigo-500 hover:to-purple-500" type="submit" name="subscribe">Subscribe
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Links & Social Section */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-18">
                {/* Platform Links */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Platform</h4>
                  <ul className="space-y-3">
                    <li><Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      Home
                    </Link></li>
                    <li><Link href="/features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      Features
                    </Link></li>
                    <li><Link href="/learn" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      Learn
                    </Link></li>
                    <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                      Contact
                    </Link></li>
                  </ul>
                </div>

                {/* Team Links */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Team</h4>
                  <ul className="space-y-3">
                    <li><Link href="/team/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">About Us</Link></li>
                    <li><Link href="/team/journey" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Our Journey</Link></li>
                  </ul>
                </div>

                {/* Support Links */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h4>
                  <ul className="space-y-3">
                    <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                    <li><Link href="/support/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/support/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                  </ul>
                  
                  {/* follow us */}
                   <div className="mt-6">
                <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-4">Follow Us</h5>
                <div className="flex gap-2">
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                       hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 flex items-center justify-center">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                       hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 flex items-center justify-center">
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                       hover:text-pink-500 transition-all duration-200 flex items-center justify-center">
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                       hover:text-blue-600 transition-all duration-200 flex items-center justify-center">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </div>
                </div>
              </div>
             

              {/* Social Links Grid */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex justify-center items-center">
            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
              © {currentYear} ByteStory. Made with <Heart className="h-4 w-4 text-purple-500" /> ByteBuilders.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}