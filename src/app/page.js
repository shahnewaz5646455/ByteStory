import Hero from "../../components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      {/* Why Choose Us */}
<section className="bg-white py-16">
  <div className="mx-auto max-w-6xl px-6">
    <h2 className="text-center text-3xl font-bold text-slate-900">
      Why Choose Us
    </h2>
    <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
      We’re building more than a blogging tool—we’re creating a space where your
      ideas grow, connect, and inspire.
    </p>

    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6v6l4 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Time-Saving</h3>
        <p className="mt-2 text-slate-600">
          Quickly turn your thoughts into organized posts with minimal effort.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Reliable</h3>
        <p className="mt-2 text-slate-600">
          Your ideas are safe with autosave and version-friendly features.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5V4H2v16h5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Community Driven</h3>
        <p className="mt-2 text-slate-600">
          Explore trending topics and grow with a network of creators like you.
        </p>
      </div>
    </div>
  </div>
</section>

    </>
  );
}