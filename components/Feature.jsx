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
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 md:mb-12 lg:mb-16 flex md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md:text-left">
            Automate Your Blogging <br className="hidden sm:block" /> and{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Get More Traffic
            </span>
          </h2>
          <Link
            href="/login"
            className="group/button relative items-center justify-center overflow-hidden rounded-lg bg-gray-900 px-5 py-3 md:px-6 md:py-3 text-sm md:text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-gray-600/50 border border-white/20 w-full sm:w-auto hidden md:inline-flex"
          >
            <span>Get Started Free</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
              <div className="relative h-full w-10 bg-white/20"></div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1"
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
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
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
            className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Start Your Free Trial
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Feature;