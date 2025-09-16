import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    imagePath: '/generate.webp',
    title: 'Write Blog Posts Fast',
    description: 'Turn ideas into complete blog posts in minutes. Write faster, rank higher, and grow your traffic effortlessly.',
  },
  {
    imagePath: '/optimize.webp',
    title: 'Smart SEO Optimization',
    description: 'Get your content search-ready automatically. Detailed reports show exactly what to improve for better rankings.',
  },
  {
    imagePath: '/publish.webp',
    title: 'One-Click Publishing',
    description: 'Publish anywhere, with one click. WordPress, Webflow, Ghost, and more, your articles go live instantly across your favorite platforms.',
  },
];

const Feature = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 md:mb-12 lg:mb-16 flex md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:text-left">
            Automate Your Blogging <br className="hidden sm:block" /> and{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Get More Traffic
            </span>
          </h2>
          <Link
            href="/login"
            className="hidden group/button relative md:inline-flex items-center justify-center overflow-hidden rounded-md hover:scale-105 bg-gray-800 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out hover:shadow-lg hover:shadow-gray-600/50 dark:hover:shadow-indigo-600/30 border border-white/20 dark:border-indigo-400/20 h-max"
          >
            <span>Get Started Free</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
              <div className="relative h-full w-10 bg-white/20 dark:bg-indigo-300/20"></div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 overflow-hidden">
                <Image
                  src={feature.imagePath}
                  alt={feature.title}
                  height={400}
                  width={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content Container */}
              <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile btn */}
        <div className="mt-10 md:hidden text-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg dark:hover:shadow-indigo-600/30 transition-all duration-300"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Feature;