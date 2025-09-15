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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <div className="mb-12 flex justify-between">
          <h2 className="text-4xl font-bold text-gray-800">
            Automate Your Blogging <br /> and <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Get More Traffic</span>
          </h2>
          <Link href="/login" className="bg-black text-white font-semibold px-8 py-3 rounded-lg cursor-pointer h-max">
              Get Started Free
            </Link>
        </div>
        <div className="flex flex-wrap -mx-4">
          {features.map((feature, index) => (
            <div key={index} className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex justify-center">
                    <Image
                      src={feature.imagePath}
                      alt={feature.title}
                      width={400}
                      height={300}
                      className="max-w-full"
                    />
                  </div>
                  <div className='p-6'>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;