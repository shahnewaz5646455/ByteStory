import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    imagePath: '/generate.webp',
    title: 'Write Blog Posts Fast',
    description: 'Turn ideas into complete blog posts in minutes. Write faster, rank higher, and grow your traffic effortlessly.',
    path: '/blog-generator'
  },
  {
    imagePath: '/optimize.webp',
    title: 'Smart SEO Optimization',
    description: 'Get your content search-ready automatically. Detailed reports show exactly what to improve for better rankings.',
    path: '/seo-checker'
  },
  {
  imagePath: '/publish.webp',
  title: 'Email Newsletter Writer',
  description: 'Create engaging email newsletters in minutes. Write compelling content that drives opens and clicks.',
  path: '/email-writer'
},
];

const Feature = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 md:mb-12 lg:mb-16 flex md:flex-row justify-between items-center md:items-start gap-6 md:gap-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 md:text-left">
            Automate Your Blogging <br className="hidden sm:block" /> and{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Get More Traffic
            </span>
          </h2>
        
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.path}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-all duration-300 overflow-hidden group hover:-translate-y-1 cursor-pointer block"
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
            </Link>
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