import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Lightbulb, Heart } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">

        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

            {/* Brand Section */}
            <div className="lg:col-span-1">
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
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white 
                           rounded-lg hover:shadow-lg transition duration-200 flex items-center gap-1 cursor-pointer hover:from-indigo-500 hover:to-purple-500">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

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
                <li><Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Our Blog</Link></li>
                <li><Link href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Careers</Link></li>
                <li><Link href="/press" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Press Kit</Link></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Support</h4>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              </ul>

              {/* Social Links */}
              <div className="mt-8">
                <h5 className="font-medium text-gray-700 dark:text-gray-200 mb-4">Follow Us</h5>
                <div className="flex space-x-4">
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                         hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                         hover:text-blue-400 transition-all duration-200">
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                         hover:text-pink-500 transition-all duration-200">
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                         hover:text-blue-600 transition-all duration-200">
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 py-6">
          <div className="flex justify-center items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
              © {currentYear} ByteStory. Made with <Heart className="h-4 w-4 text-purple-500" /> ByteBuilders.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}